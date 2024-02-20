"""
ASGI config for q_pay project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'q_pay.settings')

asgi_application = get_asgi_application()

from main.middlewares import JwtAuthMiddlewareStack
import q_pay.routing

application = ProtocolTypeRouter({
    "http": asgi_application,
    "websocket": JwtAuthMiddlewareStack(
        URLRouter(
            q_pay.routing.websocket_urlpatterns
        )
    ),
})
