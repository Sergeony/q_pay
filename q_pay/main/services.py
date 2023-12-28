from typing import List

import openpyxl

from .models import BaseTransaction, User


def create_transactions_excel(transactions, transaction_type='input'):
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.title = 'Transactions'

    if transaction_type == 'input':
        columns = ['Transaction ID', 'Status', 'Merchant', 'Bank', 'Requisites', 'Claimed Amount', 'Actual Amount',
                   'Date']
    elif transaction_type == 'output':
        columns = ['Transaction ID', 'Status', 'Amount', 'Bank', 'Card Number', 'Receipt URL', 'Date']
    else:
        raise ValueError("Invalid transaction type. Must be 'input' or 'output'.")

    for col_num, column_title in enumerate(columns, 1):
        cell = worksheet.cell(row=1, column=col_num)
        cell.value = column_title

    for row_num, transaction in enumerate(transactions, 2):
        worksheet.cell(row=row_num, column=1).value = str(transaction.transaction_id)
        worksheet.cell(row=row_num, column=2).value = transaction.get_status_display()

        if transaction_type == 'input':
            worksheet.cell(row=row_num, column=3).value = transaction.merchant_id.id
            worksheet.cell(row=row_num, column=4).value = transaction.requisites_id.bank_id.title
            worksheet.cell(row=row_num, column=5).value = transaction.requisites_id.card_number
            worksheet.cell(row=row_num, column=6).value = transaction.claimed_amount
            worksheet.cell(row=row_num, column=7).value = transaction.actual_amount or 0
        elif transaction_type == 'output':
            worksheet.cell(row=row_num, column=3).value = transaction.amount
            worksheet.cell(row=row_num, column=4).value = transaction.bank_id.title if transaction.bank_id else 'N/A'
            worksheet.cell(row=row_num, column=5).value = transaction.card_number

        worksheet.cell(row=row_num, column=8).value = transaction.created_at.strftime('%Y-%m-%d %H:%M:%S')

    return workbook


def get_eligible_trader_ids_for_transactions(transactions: List[BaseTransaction]) -> List[str]:
    eligible_trader_ids = User.objects.filter(
        user_type=User.UserTypes.TRADER,
        is_activated=True
    ).values_list('id', flat=True)

    for transaction in transactions:
        eligible_trader_ids = eligible_trader_ids.filter(
            advertisements__is_activated=True,
            advertisements__requisites_id__bank_id=transaction.requisites.bank,
        ).values_list('id', flat=True)

        if not eligible_trader_ids:
            break

    return list(eligible_trader_ids)
