from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()
router.register(r'requisites', RequisitesViewSet, 'requisites')
router.register(r'advertisements', AdvertisementsViewSet, 'advertisements')

urlpatterns = [
    path('banks/', BankListView.as_view()),
    path('', include(router.urls)),
    path('transactions/input/<str:status_group>/', InputTransactionsView.as_view()),
    path('transactions/output/<str:status_group>/', OutputTransactionsView.as_view()),
]
