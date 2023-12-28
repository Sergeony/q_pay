from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

trader_router = DefaultRouter()
trader_router.register(r'requisites', RequisitesViewSet, 'requisites')
trader_router.register(r'advertisements', AdvertisementsViewSet, 'advertisements')
trader_router.register(r'transfers', MerchantTransferViewSet, 'transfers')

merchant_router = DefaultRouter()
merchant_router.register(r'transfers', MerchantTransferViewSet, 'transfers')
merchant_router.register(r'integrations', MerchantIntegrationsViewSet, 'integrations')

admin_router = DefaultRouter()
admin_router.register(r'traders', TradersViewSet, 'traders')
admin_router.register(r'merchants', MerchantsViewSet, 'merchants')

urlpatterns = [
    path('banks/', BankListView.as_view()),
    path('trader/', include(trader_router.urls)),
    path('trader/transactions/input/<str:status_group>/', InputTransactionsView.as_view()),
    path('trader/transactions/output/<str:status_group>/', OutputTransactionsView.as_view()),
    path('trader/transactions/export/input/', ExportInputTransactionsView.as_view()),
    path('trader/transactions/export/output/', ExportOutputTransactionsView.as_view()),
    path('merchant/transactions/input/', MerchantInputTransactionsView.as_view()),
    path('merchant/transactions/output/', MerchantOutputTransactionsView.as_view()),
    path('merchant/', include(merchant_router.urls)),
    path('admin/traders/active/', ActiveTradersListView.as_view()),
    path('admin/traders/<int:user_id>/stats/', TraderStatsView.as_view()),
    path('admin/merchants/<int:user_id>/stats/', MerchantStatsView.as_view()),
    path('admin/', include(admin_router.urls)),
    path('admin/invite/', CreateInviteCodeView.as_view()),
    path('admin/transactions/input/redirect/', InputTransactionsRedirectView.as_view()),
    path('admin/transactions/output/redirect/', OutputTransactionsRedirectView.as_view()),
    path('user/settings/', UpdateUserSettingsView.as_view()),
    path('user/change-password/', ChangePasswordView.as_view()),
]
