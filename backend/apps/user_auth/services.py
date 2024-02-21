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
