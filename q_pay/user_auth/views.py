from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .services import get_user_type_by_invite_code
from .serializers import *


class UserRegisterView(GenericAPIView):
    """
    Register view for user.
    """
    serializer_class = UserRegisterSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """
        Register user using provided credentials and invite code.
        """
        invite_code = request.data.get('invite_code')
        if not invite_code:
            return Response(
                data={'invite_code': ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        user_type = get_user_type_by_invite_code(invite_code)
        if not user_type:
            return Response(
                data={'error': 'Invalid invite code or it has already been expired.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        combined_data = {
            'email': request.data.get('email'),
            'password': request.data.get('password'),
            'type': user_type,
        }
        serializer = self.get_serializer(data=combined_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            data={"message": "Registration successful!"},
            status=status.HTTP_201_CREATED,
        )


class UserLoginView(GenericAPIView):
    """
    Login first step for user.
    """
    serializer_class = UserLoginSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """
        Verify user and check, if the user has already logged in, then return only user_id,
        otherwise otp_base32 as well.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_info = serializer.save()

        return Response(
            data=login_info,
            status=status.HTTP_200_OK
        )


class UserVerifyOTPView(GenericAPIView):
    """
    Login second step for user.
    """
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_info = serializer.save()

        response = Response(
            data={"access": login_info.get("access")},
            status=status.HTTP_200_OK
        )
        response.set_cookie(
            key='refresh', 
            value=login_info.get("refresh"), 
            max_age=3600 * 24 * 1,
            secure=True,
            httponly=True,
            samesite='None',
            path='/auth/token/refresh/'
        )
        return response


class UserTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        cookie_name = 'refresh'
        if cookie_name not in request.COOKIES:
            raise InvalidToken('Refresh token is not provided in cookies')
        refresh = request.COOKIES.get(cookie_name)

        serializer_data = {'refresh': refresh}
        serializer = TokenRefreshSerializer(data=serializer_data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
