import hashlib
import hmac
import logging
from urllib.parse import urlparse

import httpx
from celery import shared_task
from django.utils import timezone


logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=4)
def notify_merchant_with_new_payment_status(self, payment_data, integration_data):
    timestamp = str(int(timezone.now().timestamp()))
    method = "POST"
    path = urlparse((integration_data['callback_url'])).path
    body = payment_data if payment_data else ''
    data_string = f"{timestamp}{method}{path}{body}"

    hmac_signature = hmac.new(integration_data['secret_key'].encode(), data_string.encode(), hashlib.sha512).hexdigest()

    try:
        response = httpx.post(
            integration_data['callback_url'],
            json=payment_data,
            headers={
                'Authorization': f'Bearer {integration_data["api_key"]}',
                'X-Timestamp': timestamp,
                'X-Signature': hmac_signature,
            })
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            logger.error(f"Path not found: {integration_data['callback_url']}")
        elif exc.response.status_code != 200:
            raise self.retry(countdown=2 ** self.request.retries * 5 * 60)
    except httpx.ReadTimeout:
        logger.error(f"Callback URL not found: {integration_data['callback_url']}")
    except Exception as e:
        logger.error(f"Unexpected error when notifying merchant: {str(e)}")
