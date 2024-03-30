import json
import logging

from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework_simplejwt.tokens import RefreshToken

from apps.api.services import get_client_ip
from apps.main.models import User
from django.conf import settings
from config.redis_client import get_redis_client


def get_user_type_by_invite_code(invite_code: str) -> int | None:
    """
    Get user type from redis using invite code and
    delete from redis it if it exists.
    """
    user_type = get_redis_client().getdel(invite_code)
    if user_type:
        return int(user_type)
    return None


def api_response(
        message: str = "",
        data: dict = None,
        errors: tuple = None,
        status: int = HTTP_200_OK
) -> Response:
    response_data = {
        "message": message,
        "data": data or {},
        "errors": errors or []
    }
    return Response(data=response_data, status=status)


logger = logging.getLogger(__name__)


def log_info(message: str, request: Request, **kwargs):
    log_entry = {
        "message": message,
        "ip": get_client_ip(request),
        "timestamp": timezone.now().isoformat(),
        "level": "info",
        **kwargs
    }
    logger.info(json.dumps(log_entry))


def log_warning(message: str, request: Request, **kwargs):
    log_entry = {
        "message": message,
        "ip": get_client_ip(request),
        "timestamp": timezone.now().isoformat(),
        "level": "warning",
        **kwargs
    }
    logger.warning(json.dumps(log_entry))


################## redis_keys.py ######################### START


def get_evc_key(user_id: int):
    return f"evc:{user_id}"


################## redis_keys.py ######################### END

def generate_and_store_evc(user_id: int) -> str:
    evc = get_random_string(
        length=settings.EVC_LENGTH,
        allowed_chars="0123456789"
    )
    redis_client = get_redis_client()
    redis_client.setex(
        name=get_evc_key(user_id),
        time=settings.EVC_LIFETIME,
        value=evc
    )
    return evc
