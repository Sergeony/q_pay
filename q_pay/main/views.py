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
    Payment,
    MerchantWithdrawal,
    PrevPaymentTrader
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
    PaymentSerializer,
    PaymentRedirectSerializer,
)
from .services import (
    create_payments_excel,
    get_eligible_trader_ids_for_payments,
    get_user_id,
    get_value_by_label
)
from .permissions import IsTraderOrAdminReadOnly, IsMerchantOrAdminReadOnly, IsAdmin
from q_pay.redis_client import get_redis_client


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
        except IntegrityError as e:
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
        except IntegrityError as e:
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
        except Http404 as e:
            return Response(data={'error': 'Ads not found'})
        instance.delete()
        return Response(data={"detail": "Ad successfully deleted."}, status=status.HTTP_204_NO_CONTENT)


class TraderPaymentListView(APIView):
    permission_classes = [IsAuthenticated, IsTraderOrAdminReadOnly]
    valid_statuses = {
        'active': [
            Payment.Status.PENDING,
        ],
        'completed': [
            Payment.Status.COMPLETED,
            Payment.Status.FAILED,
            Payment.Status.CANCELLED,
        ],
        'checking': [
            Payment.Status.REVIEWING
        ],
        'disputed': [
            Payment.Status.DISPUTING
        ]
    }

    def get(self, request, payment_type_label, status_group):
        if status_group not in self.valid_statuses:
            return Response(data={"error": "Invalid status group"}, status=status.HTTP_400_BAD_REQUEST, exception=True)

        trader_id = get_user_id(request)
        payment_type = get_value_by_label(Payment.Type, payment_type_label)

        payments = Payment.objects.filter(
            trader_id=trader_id,
            type=payment_type,
            status__in=self.valid_statuses[status_group]
        )

        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExportPaymentsView(APIView):
    permission_classes = [IsAuthenticated, IsTraderOrAdminReadOnly]

    def get(self, request, payment_type_label):
        trader_id = get_user_id(request)
        payment_type = get_value_by_label(Payment.Type, payment_type_label)

        payments = Payment.objects.filter(trader=trader_id, type=payment_type)

        bank_id = request.query_params.get('bank')
        bank_details_id = request.query_params.get('bank_details')
        date_from = request.query_params.get('from')
        date_to = request.query_params.get('to')
        payment_status_label = request.query_params.get('status')

        if status:
            payment_status = get_value_by_label(Payment.Status, payment_status_label)
            payments = payments.filter(trader_bank_details_id__bank_id=bank_id)
        if bank_id:
            payments = payments.filter(trader_bank_details_id__bank_id=bank_id)
        if bank_details_id:
            payments = payments.filter(trader_bank_details_id=bank_details_id)
        if date_from:
            payments = payments.filter(created_at__gte=date_from)
        if date_to:
            payments = payments.filter(created_at__lte=date_to)

        workbook = create_payments_excel(payments, payment_type_label)

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="payments.xlsx"'
        workbook.save(response)
        return response


class MerchantPaymentsView(APIView):
    permission_classes = [IsAuthenticated, IsMerchantOrAdminReadOnly]

    def get(self, request, payment_type_label):
        merchant_id = get_user_id(request)
        payment_type = get_value_by_label(Payment.Type, payment_type_label)

        payments = Payment.objects.filter(merchant=merchant_id, type=payment_type)
        serializer = PaymentSerializer(payments, many=True)
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

    def post(self, request):
        serializer = MerchantIntegrationsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(merchant=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, user_type):
        if user_type == 'traders':
            related_name = 'trader_payments'
        elif user_type == 'merchants':
            related_name = 'merchant_payments'
        else:
            return Response(data={'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(is_deleted=False).annotate(total_payments=Count(f'{related_name}'))
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
            time=settings.INVITE_CODE_LIFETIME,
            value=f"{user_type}"
        )
        return Response(data={'invite_code': invite_code}, status=status.HTTP_201_CREATED)


class ActiveTradersListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, *args, **kwargs):
        active_traders = User.objects.filter(is_active=True, type=User.Type.TRADER).values('id', 'email')
        return Response(active_traders, status=status.HTTP_200_OK)


class PaymentsRedirectView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, payment_type_label, *args, **kwargs):
        serializer = PaymentRedirectSerializer(
            data=request.data,
            context={'payment_type': payment_type_label}
        )
        serializer.is_valid(raise_exception=True)

        payment_ids = serializer.validated_data['payment_ids']
        new_trader_id = serializer.validated_data['new_trader_id']

        payment_type = get_value_by_label(Payment.Type, payment_type_label)
        payments = Payment.objects.filter(
            type=payment_type,
            pk__in=payment_ids,
            status=Payment.Status.PENDING
        )
        eligible_trader_ids = get_eligible_trader_ids_for_payments(payments)

        if new_trader_id not in eligible_trader_ids:
            return Response(
                data={'error': 'Trader is not eligible for specified payments'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with db_transaction.atomic():
            for payment in payments:
                PrevPaymentTrader.objects.create(
                    trader=payment.trader.id,
                    payment=payment.id
                )
                payment.trader.id = new_trader_id
                payment.save()

        return Response(
            data={'detail': f'Payments were successfully redirected to trader {new_trader_id}'},
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

        payments = Payment.objects.filter(**{related_name: pk})

        if time_filter:
            payments = payments.filter(created_at__gte=time_filter)

        summary = payments.aggregate(
            total_successful=Count('id', filter=Q(
                status=Payment.Status.COMPLETED)),
            total_unsuccessful=Count('id', filter=Q(
                status__in=[Payment.Status.CANCELLED, Payment.Status.DISPUTING])),
            total_input_amount=Sum('claimed_amount', filter=Q(
                status=Payment.Status.COMPLETED,
                type=Payment.Type.INPUT,
            )),
            total_output_amount=Sum('claimed_amount', filter=Q(
                status=Payment.Status.COMPLETED,
                type=Payment.Type.OUTPUT)),
        )

        daily_input_stats = payments.annotate(date=TruncDay('created_at')).values('date').annotate(
            count=Count('id')).order_by('date')

        combined_daily_stats = {}
        for stat in daily_input_stats:
            combined_daily_stats[stat['date']] = combined_daily_stats.get(stat['date'], 0) + stat['count']

        final_stats = {
            'total_successful': summary['total_successful'],
            'total_unsuccessful': summary['total_unsuccessful'],
            'total_input_amount': summary['total_input_amount'] or 0,
            'total_output_amount': summary['total_output_amount'] or 0,
            'daily_payment_counts': [{'date': date, 'count': count} for date, count in combined_daily_stats.items()]
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


class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UserSettingsSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        serializer = UserSettingsSerializer(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK,)
