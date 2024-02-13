from django.urls import path

from .views import *


urlpatterns = [
    path('trader/bank_details/', BankDetailsView.as_view()),
    path('trader/bank_details/<int:pk>/', BankDetailsView.as_view()),
    path('trader/ads/', AdView.as_view()),
    path('trader/ads/<int:pk>/', AdView.as_view()),
    path('trader/payments/export/<str:payment_type_label>/', ExportPaymentsView.as_view()),
    path('trader/payments/<str:payment_type_label>/<str:status_group>/', TraderPaymentListView.as_view()),

    path('merchant/payments/<str:payment_type_label>/', MerchantPaymentsView.as_view()),
    path('merchant/withdrawals/', MerchantWithdrawalView.as_view()),
    path('merchant/integrations/', MerchantIntegrationsView.as_view()),

    # path('admin/traders/active/', ActiveTradersListView.as_view()),
    path('admin/invite/', CreateInviteCodeView.as_view()),
    path('admin/payments/<str:payment_type_label>/redirect/', PaymentsRedirectView.as_view()),
    path('admin/<str:user_type>/', AdminUsersView.as_view()),
    path('admin/<str:user_type>/<int:pk>/stats/', UserStatsView.as_view()),
    path('admin/<str:user_type>/<int:pk>/', AdminUsersView.as_view()),

    path('banks/', BankListView.as_view()),
    path('user/settings/', UserSettingsView.as_view()),
    path('user/change-password/', ChangePasswordView.as_view()),
]
