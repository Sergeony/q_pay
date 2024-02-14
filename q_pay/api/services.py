from datetime import timedelta

from django.db.models import Case, When, Avg, Count, F, Q, ExpressionWrapper, fields, QuerySet
from django.db.models.functions import Coalesce

from main.models import User, Payment, BankDetails


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
        total_active_payments=Count(
            'trader_payments',
            filter=Q(trader_payments__status=Payment.Status.PENDING),
            distinct=True
        )
    ).distinct()

    return eligible_traders


def get_best_trader(eligible_traders: QuerySet[User]):
    trader = eligible_traders.annotate(
        completed_payments=Count(
            'trader_payments',
            filter=Q(trader_payments__status=Payment.Status.COMPLETED),
            distinct=True
        ),
        failed_payments=Count(
            'trader_payments',
            filter=Q(trader_payments__status=Payment.Status.FAILED),
            distinct=True
        ),
        success_rate=ExpressionWrapper(
            F('completed_payments') / (F('failed_payments') + 1),  # Avoid zero division
            output_field=fields.DurationField(),
        ),
    ).annotate(
        avg_processing_time=Coalesce(Avg(
            Case(
                When(
                    trader_payments__type=Payment.Type.INPUT,
                    then=F('trader_payments__completed_at') - F('trader_payments__finished_at')
                ),
                When(
                    trader_payments__type=Payment.Type.OUTPUT,
                    then=F('trader_payments__completed_at') - F('trader_payments__created_at')
                ),
                default=timedelta(seconds=0),
                output_field=fields.DurationField(),
            ),
            distinct=True
        ), timedelta(seconds=0)),
    ).filter(
        total_active_payments__lt=5
    ).order_by(
        'total_active_payments', '-success_rate', 'avg_processing_time'
    ).first()

    return trader


def get_trader_bank_details(trader_id: int, client_bank_id: int):
    bank_details = BankDetails.objects.filter(
            trader=trader_id, is_active=True, bank=client_bank_id
        ).order_by('?').first()

    return bank_details
