import uuid
from datetime import timedelta

from django.conf import settings
from django.db.models import Count, Sum, Q
from django.db import transaction as db_transaction, IntegrityError
from django.db.models.functions import TruncDay
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status

from .models import (
    Bank,
    MerchantIntegrations,
    User,
    BankDetails,
    Ad,
    Transaction,
    MerchantWithdrawal,
    PrevTransactionTraders
)
from .serializers import (
    BanksSerializer,
    MerchantWithdrawalSerializer,
    MerchantIntegrationsSerializer,
    UserInfoSerializer,
    UserSettingsSerializer,
    UserUpdateSerializer,
    InviteCodeSerializer,
    ChangePasswordSerializer,
    BankDetailsSerializer,
    AdSerializer,
    TransactionSerializer,
    TransactionRedirectSerializer,
    FileUploadSerializer,
)
from .services import (
    create_transactions_excel,
    get_eligible_trader_ids_for_transactions,
    process_transactions_from_df,
)
from .utils import get_value_by_label, get_user_id
from .permissions import IsTraderOrAdminReadOnly, IsMerchantOrAdminReadOnly, IsAdmin
from config.redis_client import get_redis_client


class BankListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        banks = Bank.objects.all()
        serializer = BanksSerializer(banks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BankDetailsView(APIView):
    permission_classes = [IsAuthenticated, IsTraderOrAdminReadOnly]

    def get(self, request):
        trader_id = get_user_id(request)
        bank_details = BankDetails.objects.filter(trader=trader_id, is_deleted=False)
        serializer = BankDetailsSerializer(bank_details, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            serializer = BankDetailsSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(trader=request.user)
        except IntegrityError:
            return Response(data={'error': 'Bank details already exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        instance = get_object_or_404(BankDetails, pk=pk)
        serializer = BankDetailsSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        instance = get_object_or_404(BankDetails, pk=pk)
        if instance.is_deleted:
            return Response(data={'error': 'Bank details not found'}, status=status.HTTP_404_NOT_FOUND)
        instance.is_deleted = True
        instance.save()
        return Response(data={"detail": "Bank details successfully deleted."}, status=status.HTTP_204_NO_CONTENT)


class AdView(APIView):
    permission_classes = [IsAuthenticated, IsTraderOrAdminReadOnly]

    def get(self, request):
        trader_id = get_user_id(request)
        ads = Ad.objects.filter(trader=trader_id)
        serializer = AdSerializer(ads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            serializer = AdSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(trader=request.user)
        except IntegrityError:
            return Response(data={'error': 'Ad already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        instance = get_object_or_404(Ad, pk=pk)
        serializer = AdSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            instance = get_object_or_404(Ad, pk=pk)
        except Http404:
            return Response(data={'error': 'Ads not found'})
        instance.delete()
        return Response(data={"detail": "Ad successfully deleted."}, status=status.HTTP_204_NO_CONTENT)


class TraderTransactionListView(APIView):
    permission_classes = [IsAuthenticated, IsTraderOrAdminReadOnly]
    valid_statuses = {
        'active': [
            Transaction.Status.PENDING,
        ],
        'completed': [
            Transaction.Status.COMPLETED,
            Transaction.Status.FAILED,
            Transaction.Status.CANCELLED,
        ],
        'checking': [
            Transaction.Status.REVIEWING
        ],
        'disputed': [
            Transaction.Status.DISPUTING
        ]
    }

    def get(self, request):
        status_group = request.query_params.get('statusGroup')
        transaction_type = request.query_params.get('type')

        if status_group and status_group not in self.valid_statuses:
            return Response(data={"error": "Invalid status group"}, status=status.HTTP_400_BAD_REQUEST, exception=True)

        trader_id = get_user_id(request)
        
        transactions = Transaction.objects.filter(
            trader_id=trader_id,
            type=transaction_type,

        )
        
        if status_group:
            transactions = Transaction.objects.filter(status__in=self.valid_statuses[status_group])

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExportTransactionsView(APIView):
    permission_classes = [IsAuthenticated, IsTraderOrAdminReadOnly]

    def get(self, request, transaction_type_label):
        trader_id = get_user_id(request)
        transaction_type = get_value_by_label(Transaction.Type, transaction_type_label)

        transactions = Transaction.objects.filter(trader=trader_id, type=transaction_type)

        bank_id = request.query_params.get('bank')
        bank_details_id = request.query_params.get('bank_details')
        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')
        transaction_status_label = request.query_params.get('status')

        if status:
            transaction_status = get_value_by_label(Transaction.Status, transaction_status_label)
            transactions = transactions.filter(status=transaction_status)
        if bank_id:
            transactions = transactions.filter(trader_bank_details_id__bank_id=bank_id)
        if bank_details_id:
            transactions = transactions.filter(trader_bank_details_id=bank_details_id)
        if date_from:
            transactions = transactions.filter(created_at__gte=date_from)
        if date_to:
            transactions = transactions.filter(created_at__lte=date_to)

        workbook = create_transactions_excel(transactions, transaction_type_label)

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="transactions.xlsx"'
        workbook.save(response)
        return response


class MerchantTransactionsView(APIView):
    permission_classes = [IsAuthenticated, IsMerchantOrAdminReadOnly]

    def get(self, request, transaction_type_label):
        merchant_id = get_user_id(request)
        transaction_type = get_value_by_label(Transaction.Type, transaction_type_label)

        transactions = Transaction.objects.filter(merchant=merchant_id, type=transaction_type)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MerchantWithdrawalView(APIView):
    permission_classes = [IsAuthenticated, IsMerchantOrAdminReadOnly]

    def get(self, request):
        merchant_id = get_user_id(request)
        merchant_withdrawals = MerchantWithdrawal.objects.filter(merchant=merchant_id)
        serializer = MerchantWithdrawalSerializer(merchant_withdrawals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MerchantWithdrawalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(merchant=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MerchantIntegrationsView(APIView):
    permission_classes = [IsAuthenticated, IsMerchantOrAdminReadOnly]

    def get(self, request):
        merchant_id = get_user_id(request)
        merchant_integrations = MerchantIntegrations.objects.filter(merchant=merchant_id)
        serializer = MerchantIntegrationsSerializer(merchant_integrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        integrations = MerchantIntegrations.objects.get(merchant=request.user)
        serializer = MerchantIntegrationsSerializer(integrations, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, user_type):
        if user_type == 'traders':
            users = User.objects.traders().filter(is_deleted=False).annotate(
                total_transactions=Count('trader_transactions')
            )
        elif user_type == 'merchants':
            users = User.objects.merchants().filter(is_deleted=False).annotate(
                total_transactions=Count('merchant_transactions')
            )
        else:
            return Response(data={'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserInfoSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, user_type, pk):
        user = get_object_or_404(User, pk=pk)
        if user.is_deleted:
            return Response(data={'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.is_deleted = True
        user.save()
        return Response(data={"detail": f"user successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, user_type, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateInviteCodeView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, *args, **kwargs):
        serializer = InviteCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_type = serializer.validated_data['user_type']
        invite_code = str(uuid.uuid4())

        redis_client = get_redis_client()
        redis_client.setex(
            name=invite_code,
            time=settings.QPAY_INVITE_CODE_LIFETIME,
            value=f"{user_type}"
        )
        return Response(data={'invite_code': invite_code}, status=status.HTTP_201_CREATED)


class ActiveTradersListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, *args, **kwargs):
        active_traders = User.objects.filter(is_active=True, type=User.Type.TRADER).values('id', 'email')
        return Response(active_traders, status=status.HTTP_200_OK)


class TransactionsRedirectView(APIView):
    # TODO: update using new algorithm for eligible trader searching
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, *args, **kwargs):
        serializer = TransactionRedirectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        transaction_ids = serializer.validated_data['transaction_ids']
        new_trader_id = serializer.validated_data['new_trader_id']

        transactions = Transaction.objects.filter(
            pk__in=transaction_ids,
            status=Transaction.Status.PENDING
        )
        eligible_trader_ids = get_eligible_trader_ids_for_transactions(transactions)

        if new_trader_id not in eligible_trader_ids:
            return Response(
                data={'error': 'Trader is not eligible for specified transactions'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with db_transaction.atomic():
            for transaction in transactions:
                PrevTransactionTraders.objects.create(
                    trader=transaction.trader.id,
                    transaction=transaction.id
                )
                transaction.trader.id = new_trader_id
                transaction.save()

        return Response(
            data={'detail': f'Transactions were successfully redirected to trader {new_trader_id}'},
            status=status.HTTP_200_OK
        )


class UserStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, user_type, pk):
        period = request.query_params.get('period', 'all')

        if period == 'week':
            time_filter = timezone.now() - timedelta(days=7)
        elif period == 'month':
            time_filter = timezone.now() - timedelta(days=30)
        else:
            time_filter = None

        if user_type == 'traders':
            related_name = 'trader'
        else:
            related_name = 'merchant'

        transactions = Transaction.objects.filter(**{related_name: pk})

        if time_filter:
            transactions = transactions.filter(created_at__gte=time_filter)

        summary = transactions.aggregate(
            total_successful=Count('id', filter=Q(
                status=Transaction.Status.COMPLETED)),
            total_unsuccessful=Count('id', filter=Q(
                status__in=[Transaction.Status.CANCELLED, Transaction.Status.DISPUTING])),
            total_input_amount=Sum('claimed_amount', filter=Q(
                status=Transaction.Status.COMPLETED,
                type=Transaction.Type.DEPOSIT,
            )),
            total_output_amount=Sum('claimed_amount', filter=Q(
                status=Transaction.Status.COMPLETED,
                type=Transaction.Type.WITHDRAWAL)),
        )

        daily_input_stats = transactions.annotate(date=TruncDay('created_at')).values('date').annotate(
            count=Count('id')).order_by('date')

        combined_daily_stats = {}
        for stat in daily_input_stats:
            combined_daily_stats[stat['date']] = combined_daily_stats.get(stat['date'], 0) + stat['count']

        final_stats = {
            'total_successful': summary['total_successful'],
            'total_unsuccessful': summary['total_unsuccessful'],
            'total_input_amount': summary['total_input_amount'] or 0,
            'total_output_amount': summary['total_output_amount'] or 0,
            'daily_transaction_counts': [{'date': date, 'count': count} for date, count in combined_daily_stats.items()]
        }

        return Response(final_stats, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_password = serializer.validated_data.get('old_password')
        new_password = serializer.validated_data.get('new_password')

        if not user.check_password(old_password):
            return Response(data={"error": "All password is wrong"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response(data={"detail": "Password updated successfully"}, status=status.HTTP_200_OK)


class UserPrefsView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UserSettingsSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        serializer = UserSettingsSerializer(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK,)


class FileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        merchant_id = request.user.id
        df = serializer.validated_data['file']
        process_transactions_from_df(merchant_id, df)

        return Response(data={'message': "success"}, status=status.HTTP_200_OK)
