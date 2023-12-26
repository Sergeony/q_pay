from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()
router.register(r'requisites', RequisitesViewSet, 'requisites')
router.register(r'advertisements', AdvertisementsViewSet, 'advertisements')

urlpatterns = [
    path('banks/', BankListView.as_view()),
    path('trader/', include(router.urls)),
    path('trader/transactions/input/<str:status_group>/', InputTransactionsView.as_view()),
    path('trader/transactions/output/<str:status_group>/', OutputTransactionsView.as_view()),
    path('trader/transactions/export/input/', ExportInputTransactionsView.as_view()),
    path('trader/transactions/export/output/', ExportOutputTransactionsView.as_view()),
    path('merchant/transactions/input/', MerchantInputTransactionsView.as_view()),
    path('merchant/transactions/output/', MerchantOutputTransactionsView.as_view()),
]
