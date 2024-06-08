from celery import shared_task

from .service import TronGridAPI


@shared_task
def fetch_tron_transactions():
    TronGridAPI().fetch_new_transactions()
