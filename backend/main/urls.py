from django.urls import path

from .views import (
    BankDetailsView,
    AdView,
    ExportTransactionsView,
    TraderTransactionListView,
    FileUploadView,
    MerchantTransactionsView,
    MerchantWithdrawalView,
    MerchantIntegrationsView,
    CreateInviteCodeView,
    TransactionsRedirectView,
    AdminUsersView,
    UserStatsView,
    BankListView,
    UserSettingsView,
    ChangePasswordView,
)


urlpatterns = [
    path('trader/bank_details/', BankDetailsView.as_view()),
    path('trader/bank_details/<int:pk>/', BankDetailsView.as_view()),
    path('trader/ads/', AdView.as_view()),
    path('trader/ads/<int:pk>/', AdView.as_view()),
    path('trader/transactions/export/<str:transaction_type_label>/', ExportTransactionsView.as_view()),
    path('trader/transactions/<str:transaction_type_label>/<str:status_group>/', TraderTransactionListView.as_view()),

    path('merchant/transactions/withdrawal/upload/', FileUploadView.as_view()),
    path('merchant/transactions/<str:transaction_type_label>/', MerchantTransactionsView.as_view()),
    path('merchant/withdrawals/', MerchantWithdrawalView.as_view()),
    path('merchant/integrations/', MerchantIntegrationsView.as_view()),

    # path('admin/traders/active/', ActiveTradersListView.as_view()),  # TODO: find out the purpose
    path('admin/invite/', CreateInviteCodeView.as_view()),
    path('admin/transactions/redirect/', TransactionsRedirectView.as_view()),
    path('admin/<str:user_type>/', AdminUsersView.as_view()),
    path('admin/<str:user_type>/<int:pk>/stats/', UserStatsView.as_view()),
    path('admin/<str:user_type>/<int:pk>/', AdminUsersView.as_view()),

    path('banks/', BankListView.as_view()),
    path('user/settings/', UserSettingsView.as_view()),
    path('user/change-password/', ChangePasswordView.as_view()),
]
