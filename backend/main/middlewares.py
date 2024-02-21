"""General web socket middlewares
"""
from urllib.parse import parse_qs

from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist
from django.db import close_old_connections
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken, AccessToken
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack

from main.models import User, MerchantIntegrations


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        close_old_connections()

        try:
            api_key = parse_qs(scope["query_string"].decode("utf8"))["api_key"][0]

            if api_key:
                merchant = await self.get_integration_by_api_key(api_key)
                scope["user"] = merchant
                return await super().__call__(scope, receive, send)
        except KeyError:
            pass

        token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]

        try:
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            print(e)
            return None
        else:
            token_payload = AccessToken(token).payload
            scope["user"] = await self.get_user_from_token(token_payload=token_payload)

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token_payload):
        try:
            user = User.objects.get(id=token_payload["user_id"])
            return user
        except ObjectDoesNotExist:
            return AnonymousUser()

    @database_sync_to_async
    def get_integration_by_api_key(self, api_key):
        try:
            return MerchantIntegrations.objects.get(api_key=api_key).merchant
        except MerchantIntegrations.DoesNotExist:
            return AnonymousUser()


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))
