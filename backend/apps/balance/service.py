from datetime import datetime
from decimal import Decimal

import requests
from django.conf import settings
from django.db.transaction import atomic

from apps.main.models import User, Balance, BalanceHistory
from .models import Deposit
from .utils import is_valid_uuid4


class TronGridAPI:
    BASE_URL = settings.QPAY_NETWORK_URL
    API_KEY = settings.QPAY_TRON_GRID_API_KEY

    def fetch_new_transactions(self):
        last_transaction = Deposit.objects.first()
        if last_transaction:
            min_timestamp = (last_transaction.created_at.timestamp() + 1) * 1000
        else:
            min_timestamp = 0

        url = f"{self.BASE_URL}/v1/accounts/{settings.QPAY_WALLET_ADDRESS}/transactions/trc20"
        headers = {
            "Content-Type": "application/json",
            "TRON-PRO-API-KEY": self.API_KEY,
        }
        params = {
            "only_to": True,
            "only_confirmed": True,
            "min_timestamp": min_timestamp,
            "limit": settings.QPAY_TRON_TRANSACTIONS_FETCH_LIMIT,
        }
        response = requests.get(url=url, params=params, headers=headers)

        if response.status_code != 200:
            print(f"ERROR: Error while request Tron transactions history: {response.text}")
            return

        transactions = response.json().get("data")
        if transactions is None:
            print(f"ERROR: Invalid response.\n {response.text}")
            return

        for transaction in transactions:
            print(f"\n{'='*20}\nTRANSACTION:\n ${transaction}\n{'='*20}\n")

            transaction_id = transaction.get("transaction_id")
            amount = self.get_transaction_amount(transaction)
            created_at = self.get_transaction_created_at(transaction)

            if not transaction_id or not amount or not created_at:
                print(f"ERROR: Invalid transaction in response.\n {transaction}")
                continue

            note = self.get_transaction_note(transaction_id)

            with atomic():
                if note and is_valid_uuid4(note):
                    user = User.objects.filter(deposit_note=note).first()

                    if user:
                        balance = Balance.objects.select_for_update().get(user=user)
                        balance.active_balance += amount
                        balance.save()

                        BalanceHistory.objects.create(
                            user=balance.user,
                            new_active_balance=balance.active_balance,
                            new_frozen_balance=balance.frozen_balance,
                            change_active_balance_amount=amount,
                            change_reason=BalanceHistory.ChangeReason.DEPOSIT
                        )
                    else:
                        print(f"ERROR: Couldn't find user with provided note. NOTE {note}")
                else:
                    print(f"ERROR: Note was not provided or is not valid uuid4. NOTE: {note}")
                    user = None

                Deposit.objects.create(
                    hash=transaction_id,
                    created_at=created_at,
                    amount=amount,
                    note=note,
                    user=user,
                )

    def get_transaction_note(self, transaction_id: str) -> str:
        url = f"{self.BASE_URL}/walletsolidity/gettransactionbyid"
        body = {
            "value": transaction_id,
        }
        headers = {
            "Content-Type": "application/json",
            "TRON-PRO-API-KEY": self.API_KEY,
        }
        response = requests.post(url=url, json=body, headers=headers)

        print(f"\n{'-' * 20}\nTRANSACTION INFO:\n ${response.text}\n{'=' * 20}\n")

        if response.status_code == 200:
            try:
                hex_data = response.json()["raw_data"]["data"]
            except KeyError as e:
                print(f"Error while getting note for transaction with id: {transaction_id}\n Exception: {e}")
                return ""
            return bytes.fromhex(hex_data).decode('utf-8').strip()
        else:
            return ""

    @staticmethod
    def get_transaction_amount(transaction: dict) -> Decimal:
        try:
            trx_amount = Decimal(transaction["value"])
            precision = 10 ** Decimal(transaction["token_info"]["decimals"])
            return trx_amount / precision
        except KeyError as e:
            print(f"Error while getting transaction amount with ID: {transaction['transaction_id']}\n Exception: {e}")
            return Decimal(.0)

    @staticmethod
    def get_transaction_created_at(transaction: dict) -> datetime | None:
        try:
            timestamp = transaction["block_timestamp"] / 1000
            return datetime.utcfromtimestamp(timestamp)
        except KeyError as e:
            print(f"Error while getting transaction amount with ID: {transaction['transaction_id']}\n Exception: {e}")
            return None
