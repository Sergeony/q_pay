from django.urls import path
from .views import *

urlpatterns = [
    path('payments/', PaymentAPIView.as_view()),
    path('payments/<str:order_id>/', PaymentAPIView.as_view()),
]
