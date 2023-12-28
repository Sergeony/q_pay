from typing import Type

from django.db.models import Count, F
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.serializers import Serializer
from rest_framework.views import APIView
from rest_framework import status, viewsets

from .models import (
    Bank,
    Requisites,
    Advertisement,
    InputTransaction,
    OutputTransaction,
    Transfer,
    MerchantIntegrations,
    User
)
from .serializers import (
    BanksSerializer,
    RequisitesSerializer,
    AdvertisementsSerializer,
    InputTransactionSerializer,
    OutputTransactionSerializer,
    TransferSerializer,
    MerchantIntegrationsSerializer,
    UserInfoSerializer,
    UserUpdateSerializer
)
from .permissions import IsTrader, IsMerchant
from .services import create_transactions_excel


class BankListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        banks = Bank.objects.all()
        serializer = BanksSerializer(banks, many=True)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


class RequisitesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsTrader]
    serializer_class = RequisitesSerializer

    def get_queryset(self):
        return Requisites.objects.filter(trader_id=self.request.user, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(trader_id=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response(
            data={"detail": "Requisites successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )


class AdvertisementsViewSet(viewsets.ModelViewSet):
    serializer_class = AdvertisementsSerializer
    permission_classes = [IsAuthenticated, IsTrader]

    def get_queryset(self):
        return Advertisement.objects.filter(trader_id=self.request.user)

    def perform_create(self, serializer):
        serializer.save(trader_id=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        super().destroy(self, request, *args, **kwargs)
        return Response(
            data={"detail": "Advertisement successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )


class InputTransactionsView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def get(self, request, status_group=None):
        valid_statuses = {
            'completed': [
                InputTransaction.Status.CANCELLED,
                InputTransaction.Status.EXPIRED,
                InputTransaction.Status.MANUALLY_COMPLETED,
                InputTransaction.Status.AUTO_COMPLETED
            ],
            'disputed': [
                InputTransaction.Status.DISPUTED
            ]
        }

        if status_group not in valid_statuses:
            return Response(
                data={"error": "Invalid status"},
                status=400
            )

        transactions = InputTransaction.objects.filter(
            trader_id=request.user.id,
            status__in=valid_statuses[status_group]
        )
        serializer = InputTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class OutputTransactionsView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def get(self, request, status_group=None):
        valid_statuses = {
            'completed': [
                OutputTransaction.Status.MANUALLY_COMPLETED,
                OutputTransaction.Status.EXPIRED,
                OutputTransaction.Status.CANCELLED,
            ],
            'checking': [
                OutputTransaction.Status.CONFIRMED
            ],
            'disputed': [
                InputTransaction.Status.DISPUTED
            ]
        }

        if status_group not in valid_statuses:
            return Response(
                data={"error": "Invalid status"},
                status=400
            )

        transactions = OutputTransaction.objects.filter(
            trader_id=request.user.id,
            status__in=valid_statuses[status_group]
        )
        serializer = OutputTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class BaseExportTransactionsView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]
    transaction_model: InputTransaction | OutputTransaction = None
    transaction_type: str = None

    def get(self, request):
        bank_id = request.query_params.get('bank')
        requisites_id = request.query_params.get('requisites')
        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')

        transactions = self.transaction_model.objects.all()
        if bank_id:
            transactions = transactions.filter(requisites_id__bank_id=bank_id)
        if requisites_id:
            transactions = transactions.filter(requisites_id=requisites_id)
        if date_from:
            transactions = transactions.filter(created_at__gte=date_from)
        if date_to:
            transactions = transactions.filter(created_at__lte=date_to)

        workbook = create_transactions_excel(transactions, self.transaction_type)

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="transactions.xlsx"'

        workbook.save(response)

        return response


class ExportInputTransactionsView(BaseExportTransactionsView):
    transaction_model = InputTransaction
    transaction_type = 'input'


class ExportOutputTransactionsView(BaseExportTransactionsView):
    transaction_model = OutputTransaction
    transaction_type = 'output'


class BaseMerchantTransactionsView(APIView):
    permission_classes = [IsAuthenticated, IsMerchant]
    transaction_model: InputTransaction | OutputTransaction = None
    transaction_serializer: Type[Serializer] = None

    def get(self, request):
        merchant_id = request.user.id
        transactions = self.transaction_model.objects.filter(merchant_id=merchant_id)
        serializer = self.transaction_serializer(transactions, many=True)

        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


class MerchantInputTransactionsView(BaseMerchantTransactionsView):
    transaction_model = InputTransaction
    transaction_serializer = InputTransactionSerializer


class MerchantOutputTransactionsView(BaseMerchantTransactionsView):
    transaction_model = OutputTransaction
    transaction_serializer = OutputTransactionSerializer


class MerchantTransferViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsMerchant]
    serializer_class = TransferSerializer

    def get_queryset(self):
        return Transfer.objects.filter(merchant_id=self.request.user)

    def perform_create(self, serializer):
        serializer.save(merchant_id=self.request.user)


class MerchantIntegrationsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsMerchant]
    serializer_class = MerchantIntegrationsSerializer

    def get_queryset(self):
        return MerchantIntegrations.objects.filter(merchant_id=self.request.user)

    def perform_create(self, serializer):
        serializer.save(merchant_id=self.request.user)


class BaseUsersViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    user_type = None

    def get_queryset(self):
        return User.objects.filter(
            user_type=self.user_type, is_deleted=False
        ).annotate(
            total_input_transactions=Count('inputtransaction'),
            total_output_transactions=Count('outputtransaction')
        ).annotate(
            total_transactions=F('total_input_transactions') + F('total_output_transactions')
        )

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserInfoSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_deleted = True
        user.save()
        return Response(
            data={"detail": f"{user.get_user_type_display().capitalize()} successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )


class TradersViewSet(BaseUsersViewSet):
    user_type = User.UserTypes.TRADER


class MerchantsViewSet(BaseUsersViewSet):
    user_type = User.UserTypes.MERCHANT
