import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


logger = logging.getLogger(__name__)


@shared_task
def send_evc_email(email: str, code: int):
    logger.info(f"Sending verification email to {email}")
    send_mail(
        subject='Your Email Verification Code',
        message=f'Your verification code is: {code}',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )
