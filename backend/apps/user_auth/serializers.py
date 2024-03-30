from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as _TokenObtainPairSerializer
import pyotp
from rest_framework_simplejwt.tokens import UntypedToken

from apps.main.models import User
from apps.user_auth.services import get_user_type_by_invite_code, generate_and_store_evc, get_evc_key
from config.redis_client import get_redis_client

from .tasks import send_evc_email


class SignUpSerializer(serializers.ModelSerializer):
    invite_code = serializers.CharField(required=True, write_only=True)
    tg_username = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'invite_code', 'tg_username')
        extra_kwargs = {
            "email": {"write_only": True},
            "password": {"write_only": True},
        }

    allowed_user_types = [User.Type.TRADER, User.Type.MERCHANT]

    def create(self, validated_data: dict):
        invite_code = validated_data.get("invite_code")
        user_type = get_user_type_by_invite_code(invite_code)
        if user_type not in self.allowed_user_types:
            raise serializers.ValidationError(code="invalid_user_type")

        user = User.objects.create_user(
            email=validated_data.get("email"),
            password=validated_data.get("password"),
            tg_username=validated_data.get("tg_username", ""),
            type=user_type
        )
        evc = generate_and_store_evc(user.id)
        send_evc_email.delay(user.email, evc)

        return user


class EVCVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    evc = serializers.CharField(write_only=True, max_length=settings.EVC_LENGTH)

    def validate(self, data: dict):
        email = data.get("email")
        evc = data.get("evc")

        user = User.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError(code="not_found")

        redis_client = get_redis_client()
        stored_evc = redis_client.getdel(get_evc_key(user.id))

        if stored_evc is None or stored_evc.decode("utf-8") != evc:
            raise serializers.ValidationError(code="invalid_evc")

        return user


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data: dict):
        email = data.get("email")
        password = data.get("password")
        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("User does not exists.")

        return user


class TOTPVerificationSerializer(serializers.Serializer):
    tt = serializers.CharField()
    totp = serializers.CharField()

    def validate(self, data: dict):
        tt = data.get("tt")
        totp = data.get("totp")

        try:
            untyped_token = UntypedToken(tt)
            if not untyped_token.get("temp"):
                raise InvalidToken("This is not a temporary token.")
        except TokenError as e:
            raise serializers.ValidationError(str(e))

        user_id = untyped_token.get("user_id")
        user = User.objects.filter(id=user_id).first()
        if user is None:
            raise serializers.ValidationError("User does not exist.")

        stored_totp = pyotp.TOTP(user.totp_base32)
        if not stored_totp.verify(totp):
            raise serializers.ValidationError("Invalid TOTP code.")

        return user


class TokenObtainPairSerializer(_TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)
        token['user_type'] = user.type
        return token


class TTObtainPairSerializer(_TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)
        token["temp"] = True
        return token.access_token
