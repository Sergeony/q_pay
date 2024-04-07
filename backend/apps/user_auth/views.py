from django.conf import settings
from django.db import IntegrityError
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework import status
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView as _TokenRefreshView
from rest_framework.exceptions import ErrorDetail

from config.redis_client import get_redis_client
from .serializers import (
    SignUpSerializer,
    EVCVerificationSerializer,
    SignInSerializer,
    TOTPVerificationSerializer,
    TokenObtainPairSerializer,
    TTObtainPairSerializer,
)
from .services import (
    api_response,
    log_info,
    log_warning,
    get_evc_key,
)
from .tasks import send_evc_email
from ..main.models import User


class SignUpView(APIView):
    """
    Sign Up view for users.

    It is intended for traders and merchants only.
    """
    def post(self, request: Request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if not serializer.is_valid():
            log_warning(
                message=f"Sign up failed.",
                request=request,
                details=serializer.errors
            )
            return api_response(
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = serializer.save()
            log_info(
                message=f"Sign up successful.",
                request=request,
                user_id=user.id
            )
            return api_response(
                message="User signed up successfully. Please verify your email.",
                status=status.HTTP_201_CREATED
            )
        except IntegrityError as e:
            if "email" in str(e):
                log_warning(
                    message="Sign up failed.",
                    request=request,
                    details="User with that email already exists.",
                    email=request.data.get("email")
                )
                return api_response(
                    message="A user with that email already exists.",
                    status=status.HTTP_409_CONFLICT
                )
            # TODO: INSPECT FOR OTHER INTEGRITY ERRORS


class EVCVerificationView(APIView):
    def post(self, request: Request, *args, **kwargs):
        serializer = EVCVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            error_details = serializer.errors.get("non_field_errors", [])

            if error_details:
                if isinstance(error_details[0], ErrorDetail) and error_details[0].code == "invalid_evc":
                    status_code = status.HTTP_400_BAD_REQUEST
                elif isinstance(error_details[0], ErrorDetail) and error_details[0].code == "user_not_found":
                    status_code = status.HTTP_404_NOT_FOUND
            log_warning(
                message=f"Email verification failed.",
                request=request,
                detatils=[error_details[0].code]
            )
            return api_response(
                errors=[error_details[0].code],
                status=status_code
            )

        user = serializer.validated_data
        user.email_verified = True
        user.save(update_fields=["email_verified"])

        log_info(
            message=f"Email verified successfully.",
            request=request,
            user_id=user.id
        )
        tt = TTObtainPairSerializer.get_token(user)
        return api_response(
            message="Email verified successfully.",
            data={"totp_base32": user.totp_base32, "tt": str(tt)},
            status=status.HTTP_200_OK
        )


class SignInView(APIView):
    def post(self, request: Request):
        serializer = SignInSerializer(data=request.data)
        if not serializer.is_valid():
            log_warning(
                message=f"Invalid login credentials.",
                request=request,
                details=serializer.errors
            )
            return api_response(
                errors=serializer.errors,
                status=status.HTTP_404_NOT_FOUND
            )

        user = serializer.validated_data

        if not user.email_verified:
            log_warning(
                message="Email is not verified.",
                request=request,
                user_id=user.id
            )
            return api_response(
                errors=tuple(["email_not_verified"]),
                status=status.HTTP_403_FORBIDDEN
            )

        tt = TTObtainPairSerializer.get_token(user)

        data = {"tt": str(tt)}
        if user.last_seen is None:
            user.last_seen = timezone.now()
            user.save(update_fields=["last_seen"])
            data["totp_base32"] = user.totp_base32
            log_info(
                message=f"TOTP not setup.",
                request=request,
                user_id=user.id
            )
            return api_response(
                message="TOTP not setup.",
                data=data,
                errors=tuple(["totp_not_setup"]),
                status=status.HTTP_403_FORBIDDEN
            )

        log_info(
            message=f"Auth 1st step successful.",
            request=request,
            user_id=user.id
        )
        return api_response(
            message="Auth 1st step successful.",
            data=data,
            status=status.HTTP_200_OK
        )


class EVCResendView(APIView):
    """
    Handles requests for resending email verification codes (EVC).
    """
    def post(self, request: Request):
        email = request.data.get("email")
        if not email:
            log_warning(
                message="Email not provided.",
                request=request,
                email=email
            )
            return api_response(
                message="Email is required.",
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email=email).first()
        if not user:
            log_warning(
                message="User does not exist.",
                request=request
            )
            return api_response(
                message="User not found.",
                status=status.HTTP_404_NOT_FOUND
            )

        if user.email_verified and user.last_seen is None:
            log_warning(
                message="Email already verified.",
                request=request,
                user_id=user.id
            )
            return api_response(
                message="Email already verified.",
                status=status.HTTP_409_CONFLICT
            )

        evc_key = get_evc_key(user.id)
        redis_client = get_redis_client()
        ttl = redis_client.ttl(evc_key)

        if ttl > 0:
            log_warning(
                message=f"EVC cooldown is active",
                request=request,
                user_id=user.id,
                cooldown=ttl
            )
            return api_response(
                data={"ttl": ttl},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        evc = get_random_string(
            length=settings.QPAY_EVC_LENGTH,
            allowed_chars="0123456789"
        )
        redis_client.setex(
            name=evc_key,
            time=settings.QPAY_EVC_LIFETIME,
            value=evc
        )
        send_evc_email.delay(email, evc)

        log_info(
            message="EVC resent successfully.",
            request=request,
            user_id=user.id
        )
        return api_response(
            message="EVC resent successfully.",
            status=status.HTTP_200_OK
        )


class TOTPVerificationView(APIView):
    def post(self, request: Request):
        auth_header: str = request.headers.get("Authorization", "")
        tt = auth_header.split(" ", 1)[-1] if " " in auth_header else auth_header

        if tt is None:
            log_warning(
                message=f"Authentication 2nd step failed.",
                request=request,
            )
            return api_response(
                errors=tuple(["TT not provided"]),
                status=status.HTTP_400_BAD_REQUEST
            )

        initial_data = {"tt": tt, "totp": request.data.get("totp")}
        serializer = TOTPVerificationSerializer(data=initial_data)
        if not serializer.is_valid():
            log_warning(
                message=f"Authentication 2nd step failed.",
                request=request,
            )
            return api_response(
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validated_data
        token = TokenObtainPairSerializer.get_token(user)

        response = api_response(
            message="Authentication successful.",
            data={"access": str(token.access_token)},
            status=status.HTTP_200_OK
        )
        response.set_cookie(
            key="refresh",
            value=str(token),
            httponly=True,
            samesite="Strict",
            secure=settings.QPAY_REFRESH_SECURE_SSL_REDIRECT,
            path=reverse("token_refresh"),
            max_age=settings.REFRESH_TOKEN_LIFETIME,
        )

        log_info(
            message=f"Authentication successful.",
            request=request,
            user_id=user.id
        )
        return response


class TokenRefreshView(_TokenRefreshView):
    def post(self, request: Request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh")
        if refresh is None:
            log_warning(
                message=f"Refresh token not found in cookies.",
                request=request,
            )
            return api_response(
                errors=tuple(["Refresh token not found in cookies."]),
                status=status.HTTP_400_BAD_REQUEST
            )

        request.data["refresh"] = refresh
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            log_info(
                message=f"Token refreshed successfully.",
                request=request,
                user_id=getattr(request.user, "id", None)
            )
        return response
