from datetime import timedelta

from django.db.models import Case, When, Avg, Count, F, Q, ExpressionWrapper, fields, QuerySet
from django.db.models.functions import Coalesce
from django.conf import settings

from main.models import User, Transaction, BankDetails


def get_eligible_traders(client_bank_id: int, amount: float) -> QuerySet[User]:
    eligible_traders = User.objects.filter(
        is_active=True,
        type=User.Type.TRADER,
        ads__is_active=True,
        ads__bank=client_bank_id,
        ads__bank_details__is_active=True,
        ads__bank_details__daily_limit__gte=F('ads__bank_details__current_daily_turnover') + amount,
        ads__bank_details__weekly_limit__gte=F('ads__bank_details__current_weekly_turnover') + amount,
        ads__bank_details__monthly_limit__gte=F('ads__bank_details__current_monthly_turnover') + amount,
    ).annotate(
        total_active_transactions=Count(
            'trader_transactions',
            filter=Q(trader_transactions__status=Transaction.Status.PENDING),
            distinct=True
        )
    ).distinct()

    return eligible_traders


def get_best_trader(eligible_traders: QuerySet[User]):
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
    ).filter(
        total_active_transactions__lt=settings.MAX_TRADER_ACTIVE_DEPOSIT_TRANSACTIONS
    ).order_by(
        'total_active_transactions', '-success_rate', 'avg_processing_time'
    ).first()

    return trader


def get_trader_bank_details(trader_id: int, client_bank_id: int):
    bank_details = BankDetails.objects.filter(
            trader=trader_id, is_active=True, bank=client_bank_id
        ).order_by('?').first()

    return bank_details
