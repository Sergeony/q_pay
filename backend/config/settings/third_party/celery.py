from django.utils import timezone

from ..env import env


__all__ = [
    "CELERY_BROKER_URL",
    "CELERY_RESULT_BACKEND",
    "CELERY_CACHE_BACKEND",
    "CELERY_BEAT_SCHEDULER",
    "CELERY_BEAT_SCHEDULE",
]


CELERY_BROKER_URL = f"redis://{env('REDIS_HOST')}:{env('REDIS_PORT')}/{env('REDIS_DB')}"
CELERY_RESULT_BACKEND = f"django-db"
CELERY_CACHE_BACKEND = "default"
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers.DatabaseScheduler"
CELERY_BEAT_SCHEDULE = {
    "check_for_expired_transactions": {
        "task": "apps.api.tasks.set_auto_dispute_on_transaction_expiring",
        "schedule": timezone.timedelta(seconds=15),
    },
    "fetch_tron_transactions": {
        "task": "apps.balance.tasks.fetch_tron_transactions",
        "schedule": timezone.timedelta(seconds=10),
    },
}
