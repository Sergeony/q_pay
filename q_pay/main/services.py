from typing import List

import openpyxl
from django.db.models.enums import ChoicesMeta
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from .models import User, Payment


def get_user_id(request: Request) -> int | Response:
    """
    Get user_id from request user if it's one of trader, merchant or
    from query params if it's admin
    otherwise  raise exception
    """
    if request.user.user_type != User.Type.ADMIN:
        return request.user.id

    user_id = request.query_params.get('user_id')
    if user_id is None:
        return Response(data={"error": "user id were not provided"}, status=status.HTTP_400_BAD_REQUEST, exception=True)


def create_payments_excel(payments: List[Payment], payment_type='input'):
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.title = 'Transactions'

    if payment_type == 'input':
        columns = ['Transaction ID', 'Status', 'Merchant', 'Bank', 'Requisites', 'Claimed Amount', 'Actual Amount',
                   'Date']
    elif payment_type == 'output':
        columns = ['Transaction ID', 'Status', 'Amount', 'Bank', 'Card Number', 'Receipt URL', 'Date']
    else:
        raise ValueError("Invalid payment type. Must be 'input' or 'output'.")

    for col_num, column_title in enumerate(columns, 1):
        cell = worksheet.cell(row=1, column=col_num)
        cell.value = column_title

    for row_num, payment in enumerate(payments, 2):
        worksheet.cell(row=row_num, column=1).value = str(payment.id)
        worksheet.cell(row=row_num, column=2).value = payment.get_status_display()

        if payment_type == 'input':
            worksheet.cell(row=row_num, column=3).value = payment.merchant.id
            worksheet.cell(row=row_num, column=4).value = payment.trader_bank_details.bank.title
            worksheet.cell(row=row_num, column=5).value = payment.trader_bank_details.card_number
            worksheet.cell(row=row_num, column=6).value = payment.amount
            worksheet.cell(row=row_num, column=7).value = payment.amount_credit or 0
        elif payment_type == 'output':
            worksheet.cell(row=row_num, column=3).value = payment.amount
            if payment.trader_bank_details:
                value = payment.trader_bank_details.bank.title
            else:
                value = 'N/A'
            worksheet.cell(row=row_num, column=4).value = value
            worksheet.cell(row=row_num, column=5).value = payment.client_card_number

        worksheet.cell(row=row_num, column=8).value = payment.created_at.strftime('%Y-%m-%d %H:%M:%S')

    return workbook


def get_eligible_trader_ids_for_payments(payments: List[Payment]) -> List[str]:
    eligible_trader_ids = User.objects.filter(
        user_type=User.Type.TRADER,
        is_active=True
    ).values_list('id', flat=True)

    for payment in payments:
        eligible_trader_ids = eligible_trader_ids.filter(
            advertisements__is_active=True,
            advertisements__bank_id=payment.trader_bank_details.bank,
        ).values_list('id', flat=True)

        if not eligible_trader_ids:
            break

    return list(eligible_trader_ids)


def get_value_by_label(choices_class: ChoicesMeta, label: str) -> int | Response:
    """
    Get int value from choices by label
    otherwise raise exception
    """
    for choice in choices_class.choices:
        if label == choice[1]:
            return choice[0]

    return Response(data={"error": f"Invalid {choices_class}"}, status=status.HTTP_400_BAD_REQUEST, exception=True)
