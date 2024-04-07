__all__ = [
    "REST_FRAMEWORK",
]


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # TODO: consider it: by uncommenting it will causing 403 instead of proper 401
        # "apps.api.authentication.SignatureAuthentication",
        "apps.user_auth.authentication.JWTAuthentication",
    ),
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "1000/day",
    }
}
