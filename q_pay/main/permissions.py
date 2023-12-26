from rest_framework import permissions

from .models import User


class IsTrader(permissions.BasePermission):
    def has_permission(self, request, view):
        user_type = request.auth.payload.get('user_type')
        return user_type == User.UserTypes.TRADER
