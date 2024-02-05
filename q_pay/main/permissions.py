from rest_framework.permissions import BasePermission, SAFE_METHODS

from .models import User


class IsTraderOrAdminReadOnly(BasePermission):
    """Allows access to traders for any request, but restricts admin access to read-only operations.
    """
    def has_permission(self, request, view):
        user_type = request.auth.payload.get('user_type')
        return (
            user_type == User.UserTypes.TRADER or
            (user_type == User.UserTypes.ADMIN and request.method in SAFE_METHODS)
        )


class IsMerchantOrAdminReadOnly(BasePermission):
    """Allows access to merchants for any request, but restricts admin access to read-only operations.
    """
    def has_permission(self, request, view):
        user_type = request.auth.payload.get('user_type')
        return (
            user_type == User.UserTypes.MERCHANT or
            (user_type == User.UserTypes.ADMIN and request.method in SAFE_METHODS)
        )
