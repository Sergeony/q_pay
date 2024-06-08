import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

asgi_application = get_asgi_application()


from apps.main.middlewares import JwtAuthMiddlewareStack
from apps.main.ws_urls import websocket_urlpatterns


application = ProtocolTypeRouter({
    "http": asgi_application,
    "websocket": JwtAuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
})
