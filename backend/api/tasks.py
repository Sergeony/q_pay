import hashlib
import hmac
import logging
from urllib.parse import urlparse

import httpx
from celery import shared_task
from django.conf import settings
from django.db.models import F
from django.db.transaction import atomic
from django.utils import timezone

from api.services import (
    get_eligible_traders_and_bank_details,
    get_best_trader_and_bank_details
)
from main.models import Transaction, MerchantIntegrations, User
from main.serializers import TransactionSerializer

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=4)
def notify_merchant_with_new_transaction_status(self, transaction: Transaction):
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
def set_auto_dispute_on_transaction_expiring():
    now = timezone.now()
    pending_transactions = Transaction.objects.filter(
        status=Transaction.Status.PENDING,
        created_at__lte=now - F('lifetime')
    )
    for transaction in pending_transactions:
        transaction.status = Transaction.Status.DISPUTING
        transaction.save()


@shared_task(bind=True, max_retries=4)
def process_transaction_task(self, transaction_data, merchant_id: int):
    client_bank_id = transaction_data.get('client_bank_id')
    amount = transaction_data.get('amount')

    with atomic():
        merchant_balance = User.objects.get(pk=merchant_id).balance.active_balance
        if merchant_balance < amount:
            return

        eligible_traders = get_eligible_traders_and_bank_details(client_bank_id, amount)
        best_trader = get_best_trader_and_bank_details(eligible_traders)
        if best_trader:
            try:
                Transaction.objects.create(
                    order_id=transaction_data.get('order_id'),
                    type=Transaction.Type.WITHDRAWAL,
                    trader_id=best_trader.id,
                    merchant_id=merchant_id,
                    amount=amount,
                    trader_commission=2,
                    service_commission=5,
                    trader_bank_details_id=best_trader.eligible_bank_details_id,
                    client_card_number=transaction_data.get('client_card_number'),
                    client_bank_id=client_bank_id,
                    client_id=transaction_data.get('client_id'),
                )
            except Exception as e:
                print("ERROR IN CREATE TRANSACTION TASK: ", e)
        else:
            raise self.retry(countdown=settings.PROCESS_TRANSACTION_TASK_DELAY)
