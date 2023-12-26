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

from main.models import User


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        close_old_connections()

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


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))
