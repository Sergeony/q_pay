from django.urls import path
from .views import *

urlpatterns = [
    path('request/', RequestAPIView.as_view()),
]
