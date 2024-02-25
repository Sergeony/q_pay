from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp

from apps.main.models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password", "type")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data: dict):
        user_info = {
            "email": validated_data.get("email"),
            "type": validated_data.get("type"),
            "password": validated_data.get("password"),
        }
        user = User.objects.create_user(**user_info)

        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    otp = serializers.CharField(required=False, write_only=True)

    def validate(self, attrs: dict):
        email = attrs.get("email").strip()
        password = attrs.get("password")
        otp = attrs.get("otp")

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password
        )
        if not user:
            raise exceptions.AuthenticationFailed("Invalid login credentials.")

        if otp:
            is_otp_valid = pyotp.TOTP(user.otp_base32).verify(otp)
            if not is_otp_valid:
                raise exceptions.AuthenticationFailed("Invalid OTP.")

        attrs["user"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user = validated_data.get("user")

        if validated_data.get("otp") is None:
            if user.last_seen is None:
                return {
                    "otp_base32": user.otp_base32
                }
            else:
                return {}

        user.last_seen = timezone.now()
        user.save()
        refresh = RefreshToken.for_user(user)
        refresh['user_type'] = user.type
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
