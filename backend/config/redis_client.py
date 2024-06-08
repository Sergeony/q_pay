from redis import StrictRedis
from config.settings.env import env


def get_redis_client():
    return StrictRedis(
        host=env('REDIS_HOST'),
        port=env('REDIS_PORT'),
        db=env('REDIS_DB')
    )
