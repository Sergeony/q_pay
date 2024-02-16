import hashlib
import hmac
import logging
from urllib.parse import urlparse

import httpx
from celery import shared_task
from django.db.models import F
from django.utils import timezone

from main.models import Transaction, MerchantIntegrations
from main.serializers import TransactionSerializer

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=4)
def notify_merchant_with_new_transaction_status(self, transaction_id: str):
    transaction = Transaction.objects.get(pk=transaction_id)
    integration = MerchantIntegrations.objects.get(merchant=transaction.merchant)
    transaction_data = TransactionSerializer(transaction).data

    timestamp = str(int(timezone.now().timestamp()))
    method = "POST"
    path = urlparse(integration.callback_url).path
    body = transaction_data if transaction_data else ''
    data_string = f"{timestamp}{method}{path}{body}"

    hmac_signature = hmac.new(integration.secret_key.encode(), data_string.encode(), hashlib.sha512).hexdigest()

    try:
        response = httpx.post(  # TODO: add status codes for unsuccessful responses;
            integration.callback_url,
            json=transaction_data,
            headers={
                'Authorization': f'Bearer {integration.api_key}',
                'X-Timestamp': timestamp,
                'X-Signature': hmac_signature,
            })
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            logger.error(f"Path not found: {integration.callback_url}")
        elif exc.response.status_code != 200:
            raise self.retry(countdown=2 ** self.request.retries * 5 * 60)
    except httpx.ReadTimeout:
        logger.error(f"Callback URL not found: {integration.callback_url}")
    except Exception as e:
        logger.error(f"Unexpected error when notifying merchant: {str(e)}")


@shared_task
def check_pending_transactions():
    now = timezone.now()
    pending_transactions = Transaction.objects.filter(
        status=Transaction.Status.PENDING,
        created_at__lte=now - F('lifetime')
    )
    for transaction in pending_transactions:
        transaction.status = Transaction.Status.DISPUTING
        transaction.save()
