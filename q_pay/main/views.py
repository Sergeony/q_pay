import uuid
from datetime import timedelta
from typing import Type

from django.conf import settings
from django.db.models import Count, F, Sum, Q
from django.db import transaction as db_transaction
from django.db.models.functions import TruncDay
from django.http import HttpResponse
from django.utils import timezone
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
    User, PrevInputTransactionTrader, PrevOutputTransactionTrader
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
    UserUpdateSerializer,
    InviteCodeSerializer,
    TransactionRedirectSerializer,
    ChangePasswordSerializer,
    UserSettingsSerializer
)
from .services import (
    create_transactions_excel,
    get_eligible_trader_ids_for_transactions
)
from .permissions import IsTrader, IsMerchant
from q_pay.redis_client import get_redis_client


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


class CreateInviteCodeView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = InviteCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_type = serializer.validated_data['user_type']
        invite_code = str(uuid.uuid4())

        redis_client = get_redis_client()
        redis_client.setex(
            name=invite_code,
            time=settings.INVITE_CODE_LIFETIME,
            value=f"{user_type}"
        )

        return Response(
            data={'invite_code': invite_code},
            status=status.HTTP_201_CREATED
        )


class ActiveTradersListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        active_traders = User.objects.filter(
            is_activated=True,
            user_type=User.UserTypes.TRADER
        ).values('id', 'email')

        return Response(
            data=active_traders,
            status=status.HTTP_200_OK
        )


class BaseTransactionRedirectView(APIView):
    queryset = None
    transaction_status = None
    prev_transaction_trader_model: PrevInputTransactionTrader | PrevOutputTransactionTrader = None

    def patch(self, request, *args, **kwargs):
        serializer = TransactionRedirectSerializer(data=request.data, context={'transaction_type': 'input'})
        serializer.is_valid(raise_exception=True)

        transaction_ids = serializer.validated_data['transaction_ids']
        new_trader_id = serializer.validated_data['new_trader_id']

        transactions = self.queryset.filter(
            pk__in=transaction_ids,
            status=self.transaction_status
        )
        eligible_trader_ids = get_eligible_trader_ids_for_transactions(transactions)

        if new_trader_id not in eligible_trader_ids:
            return Response(
                data={'error': 'Trader is not eligible for specified transactions'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with db_transaction.atomic():
            for transaction in transactions:
                self.prev_transaction_trader_model.objects.create(
                    trader_id=transaction.trader_id,
                    transaction_id=transaction.transaction_id
                )
                transaction.trader_id = new_trader_id
                transaction.save()

        return Response(
            data={'message': f'Transactions were successfully redirected to trader {new_trader_id}'},
            status=status.HTTP_200_OK
        )


class InputTransactionsRedirectView(BaseTransactionRedirectView):
    queryset = InputTransaction.objects.all()
    transaction_status = InputTransaction.Status.PENDING_CLIENT_CONFIRMATION
    prev_transaction_trader_model = PrevInputTransactionTrader


class OutputTransactionsRedirectView(BaseTransactionRedirectView):
    queryset = OutputTransaction.objects.all()
    transaction_status = OutputTransaction.Status.PENDING_TRADER_CONFIRMATION
    prev_transaction_trader_model = PrevOutputTransactionTrader


class BaseUserStatsView(APIView):
    permission_classes = [IsAdminUser]
    user_id_field = None

    def get(self, request, user_id):
        period = request.query_params.get('period', 'all')

        if period == 'week':
            time_filter = timezone.now() - timedelta(days=7)
        elif period == 'month':
            time_filter = timezone.now() - timedelta(days=30)
        else:
            time_filter = None

        input_transactions = InputTransaction.objects.filter(**{self.user_id_field: user_id})
        output_transactions = OutputTransaction.objects.filter(**{self.user_id_field: user_id})

        if time_filter:
            input_transactions = input_transactions.filter(created_at__gte=time_filter)
            output_transactions = output_transactions.filter(created_at__gte=time_filter)

        input_summary = input_transactions.aggregate(
            total_successful=Count('id', filter=Q(
                status__in=[InputTransaction.Status.MANUALLY_COMPLETED, InputTransaction.Status.AUTO_COMPLETED])),
            total_unsuccessful=Count('id', filter=Q(
                status__in=[InputTransaction.Status.CANCELLED, InputTransaction.Status.DISPUTED])),
            total_amount=Sum('claimed_amount', filter=Q(status=InputTransaction.Status.MANUALLY_COMPLETED))
        )

        output_summary = output_transactions.aggregate(
            total_successful=Count('id', filter=Q(
                status=OutputTransaction.Status.MANUALLY_COMPLETED)),
            total_unsuccessful=Count('id', filter=Q(
                status__in=[OutputTransaction.Status.CANCELLED, OutputTransaction.Status.DISPUTED])),
            total_amount=Sum('amount', filter=Q(status=OutputTransaction.Status.MANUALLY_COMPLETED))
        )

        daily_input_stats = input_transactions.annotate(date=TruncDay('created_at')).values('date').annotate(
            count=Count('id')).order_by('date')
        daily_output_stats = output_transactions.annotate(date=TruncDay('created_at')).values('date').annotate(
            count=Count('id')).order_by('date')

        combined_daily_stats = {}
        for stat in daily_input_stats:
            combined_daily_stats[stat['date']] = combined_daily_stats.get(stat['date'], 0) + stat['count']
        for stat in daily_output_stats:
            combined_daily_stats[stat['date']] = combined_daily_stats.get(stat['date'], 0) + stat['count']

        final_stats = {
            'total_successful': input_summary['total_successful'] + output_summary['total_successful'],
            'total_unsuccessful': input_summary['total_unsuccessful'] + output_summary['total_unsuccessful'],
            'total_input_amount': input_summary['total_amount'] or 0,
            'total_output_amount': output_summary['total_amount'] or 0,
            'daily_transaction_counts': [{'date': date, 'count': count} for date, count in combined_daily_stats.items()]
        }

        return Response(
            data=final_stats,
            status=status.HTTP_200_OK
        )


class TraderStatsView(BaseUserStatsView):
    user_id_field = 'trader_id'


class MerchantStatsView(BaseUserStatsView):
    user_id_field = 'merchant_id'


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_password = serializer.validated_data.get('old_password')
        new_password = serializer.validated_data.get('new_password')

        if not user.check_password(old_password):
            return Response(
                data={"old_password": ["Wrong password."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            data={"message": "Password updated successfully."},
            status=status.HTTP_200_OK
        )


class UpdateUserSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UserSettingsSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            data={"message": "User settings updated successfully."},
            status=status.HTTP_200_OK
        )
