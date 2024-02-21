import hashlib
import hmac
import re

from django.conf import settings
from django.utils import timezone
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

from apps.main import MerchantIntegrations
from apps.user_auth.authentication import JWTAuthentication


class SignatureAuthentication(BaseAuthentication):
    def authenticate(self, request):
        if not re.match(r'^/api/v\d+/', request.path):
            jwt_auth = JWTAuthentication()
            return jwt_auth.authenticate(request)

        authorization_header = request.headers.get('Authorization')
        timestamp = request.headers.get('X-Timestamp')
        signature = request.headers.get('X-Signature')

        if not all([authorization_header, timestamp, signature]):
            raise exceptions.AuthenticationFailed('Authentication credentials were not provided')

        api_key = self.get_api_key_from_header(authorization_header)
        if not api_key:
            raise exceptions.AuthenticationFailed('Invalid Authorization header')

        integration = self.get_integration_by_api_key(api_key)
        if not integration:
            raise exceptions.AuthenticationFailed('Invalid API key')

        if not self.validate_timestamp(timestamp):
            raise exceptions.AuthenticationFailed('Invalid or expired timestamp')

        if not self.validate_signature(request, timestamp, signature, integration.secret_key):
            raise exceptions.AuthenticationFailed('Invalid signature')

        return integration.merchant, None

    @staticmethod
    def get_api_key_from_header(authorization_header):
        if authorization_header.startswith('Bearer '):
            return authorization_header.split('Bearer ')[-1].strip()
        else:
            return None

    @staticmethod
    def get_integration_by_api_key(api_key):
        try:
            return MerchantIntegrations.objects.get(api_key=api_key)
        except MerchantIntegrations.DoesNotExist:
            return None

    @staticmethod
    def validate_timestamp(timestamp):
        try:
            request_time = timezone.datetime.fromtimestamp(int(timestamp), tz=timezone.utc)
        except ValueError:
            return False

        server_time = timezone.now()

        return server_time - request_time < settings.API_REQUEST_TIME_TIMEOUT

    @staticmethod
    def validate_signature(request, timestamp, signature, secret_key):
        method = request.method
        path = request.get_full_path()
        body = request.body.decode('utf-8') if request.body else ''
        data = f"{timestamp}{method}{path}{body}"

        hmac_signature = hmac.new(secret_key.encode(), data.encode(), hashlib.sha512).hexdigest()

        return hmac_signature == signature
