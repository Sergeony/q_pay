from django.utils import timezone


__all__ = [
    "QPAY_INVITE_CODE_LIFETIME",
    "QPAY_TT_LIFETIME",
    "QPAY_EVC_RESEND_LIMIT",
    "QPAY_EVC_RESEND_LIMIT_PERIOD",
    "QPAY_EVC_LIFETIME",
    "QPAY_EVC_LENGTH",
    "QPAY_REFRESH_SECURE_SSL_REDIRECT",
]


QPAY_INVITE_CODE_LIFETIME = timezone.timedelta(minutes=30)


QPAY_TT_LIFETIME = timezone.timedelta(minutes=5)


QPAY_EVC_RESEND_LIMIT = 10

QPAY_EVC_RESEND_LIMIT_PERIOD = timezone.timedelta(hours=1)

QPAY_EVC_LIFETIME = timezone.timedelta(minutes=5)

QPAY_EVC_LENGTH = 6

QPAY_REFRESH_SECURE_SSL_REDIRECT = True
