from datetime import timedelta

from django.db.models import (
    Case, When, Avg, Count, F, Q, ExpressionWrapper,
    fields, QuerySet, OuterRef, Subquery, DecimalField,
)
from django.db.models.functions import Coalesce
from django.conf import settings

from apps.main import User, Transaction, BankDetails, Balance


def get_eligible_traders_and_bank_details(client_bank_id: int,
                                          amount: float,
                                          check_balance: bool = False) -> QuerySet[User]:
    eligible_bank_details = BankDetails.objects.filter(
        bank_id=client_bank_id,
        is_active=True,
        daily_limit__gte=F('current_daily_turnover') + amount,
        weekly_limit__gte=F('current_weekly_turnover') + amount,
        monthly_limit__gte=F('current_monthly_turnover') + amount,
    )

    eligible_traders_and_bank_details = User.objects.filter(
        is_active=True,
        type=User.Type.TRADER,
        ads__is_active=True,
        ads__bank=client_bank_id,
    ).annotate(
        total_active_transactions=Count(
            'trader_transactions',
            filter=Q(trader_transactions__status__in=[Transaction.Status.PENDING, Transaction.Status.REVIEWING]),
            distinct=True
        ),
        eligible_bank_details_id=Subquery(
            eligible_bank_details.filter(trader_id=OuterRef('pk')).values('id')[:1]
        )
    ).filter(
        total_active_transactions__lt=settings.MAX_TRADER_ACTIVE_DEPOSIT_TRANSACTIONS,
        eligible_bank_details_id__isnull=False
    ).distinct()

    if check_balance:
        eligible_traders_and_bank_details.annotate(
            active_balance=Subquery(
                Balance.objects.filter(
                    user_id=OuterRef('pk')
                ).values('active_balance')[:1],
                output_field=DecimalField()
            )
        ).filter(active_balance__gte=amount)

    return eligible_traders_and_bank_details


def get_best_trader_and_bank_details(eligible_traders: QuerySet[User]):
    trader = eligible_traders.annotate(
        completed_transactions=Count(
            'trader_transactions',
            filter=Q(trader_transactions__status=Transaction.Status.COMPLETED),
            distinct=True
        ),
        failed_transactions=Count(
            'trader_transactions',
            filter=Q(trader_transactions__status=Transaction.Status.FAILED),
            distinct=True
        ),
        success_rate=ExpressionWrapper(
            F('completed_transactions') / (F('failed_transactions') + 1),  # Avoid zero division
            output_field=fields.DurationField(),
        ),
    ).annotate(
        avg_processing_time=Coalesce(Avg(
            Case(
                When(
                    trader_transactions__type=Transaction.Type.DEPOSIT,
                    then=F('trader_transactions__completed_at') - F('trader_transactions__finished_at')
                ),
                When(
                    trader_transactions__type=Transaction.Type.WITHDRAWAL,
                    then=F('trader_transactions__completed_at') - F('trader_transactions__created_at')
                ),
                default=timedelta(seconds=0),
                output_field=fields.DurationField(),
            ),
            distinct=True
        ), timedelta(seconds=0)),
    ).order_by(
        'total_active_transactions', '-success_rate', 'avg_processing_time'
    ).first()

    return trader


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
