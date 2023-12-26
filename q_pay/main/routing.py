from django.urls import re_path

from .consumers import *


websocket_urlpatterns = [
    re_path(r'api/v1/transactions/input/active/', ActiveInputTransactionConsumer.as_asgi()),
    re_path(r'api/v1/transactions/output/active/', ActiveOutputTransactionConsumer.as_asgi()),
]
