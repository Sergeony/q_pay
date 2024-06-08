from django.urls import re_path

from apps.main.consumers import Consumer


websocket_urlpatterns = [
    re_path(r"ws/", Consumer.as_asgi()),
]
