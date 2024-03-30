from django.db.models.enums import ChoicesMeta
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from apps.main.models import User


def get_user_id(request: Request) -> int | Response:  # TODO: move response to the view
    """
    Get the user ID to perform the request

    Use the request user if it's a non-admin user (trader or merchant), otherwise query params.
    Raise an exception if the user ID was not found.
    """
    if request.user.type != User.Type.ADMIN:
        return request.user.id

    user_id = request.query_params.get('user_id')
    if user_id is None:
        return Response(data={"error": "user id were not provided"}, status=status.HTTP_400_BAD_REQUEST, exception=True)
    return user_id



def get_value_by_label(choices_class: ChoicesMeta, label: str) -> int | Response:  # TODO: move response to the view
    """
    Get int value from the choices by the label, otherwise raise an exception
    """
    for choice in choices_class.choices:
        if label == choice[1]:
            return choice[0]

    return Response(data={"error": f"Invalid {choices_class}"}, status=status.HTTP_400_BAD_REQUEST, exception=True)
