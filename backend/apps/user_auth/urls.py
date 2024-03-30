from django.urls import path

from .views import (
    SignUpView,
    EVCVerificationView,
    SignInView,
    TOTPVerificationView,
    TokenRefreshView,
    EVCResendView,
)

urlpatterns = [
    path('sign-up/', SignUpView.as_view()),
    path('verify-evc/', EVCVerificationView.as_view()),
    path('sign-in/', SignInView.as_view()),
    path('verify-totp/', TOTPVerificationView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('resend-evc/', EVCResendView.as_view()),

]
