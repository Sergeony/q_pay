from django.urls import path
from .views import *

urlpatterns = [
    path('transactions/', TransactionAPIView.as_view()),
    path('transactions/<str:order_id>/', TransactionAPIView.as_view()),
]
