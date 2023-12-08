from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.generics import GenericAPIView

from .service import get_user_type_by_invite_code
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
        request.data._mutable = True
        request.data["user_type"] = user_type
        request._mutable = False

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            data={"message": "Registration successful!"},
            status=status.HTTP_201_CREATED,
        )


class UserLoginView(GenericAPIView):
    """
    Login view for user.
    """
    serializer_class = UserLoginSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """
        Verify user and check, if the user has already logged in, then return only user_id,
        otherwise otp_base32 as well.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        data = {"user_id": user.id}
        if user.last_seen is None:
            data["otp_base32"] = user.otp_base32

        return Response(
            data=data,
            status=status.HTTP_200_OK
        )


class UserVerifyOTPView(GenericAPIView):
    """
    OTP verification view for user.
    """
    serializer_class = UserVerifyOTPSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        """
        Verify OTP code and return refresh and access tokens.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_info = serializer.save()

        return Response(
            data=login_info,
            status=status.HTTP_200_OK
        )
