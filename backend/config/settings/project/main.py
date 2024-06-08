from django.utils import timezone


__all__ = [
    "MAX_TRANSACTION_STATUS_UPDATE_ATTEMPTS",
    "USER_ONLINE_TIMEOUT",
]


MAX_TRANSACTION_STATUS_UPDATE_ATTEMPTS = 3  # TODO: unused, find an application for it or remove it


USER_ONLINE_TIMEOUT = timezone.timedelta(seconds=5)
