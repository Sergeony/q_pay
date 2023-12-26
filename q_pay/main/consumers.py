import json

from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from main.models import InputTransaction, OutputTransaction


class BaseTransactionConsumer(AsyncWebsocketConsumer):
    transaction_model = None
    group_name_prefix = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trader_id: int | None = None
        self.group_name: str | None = None

    async def connect(self):
        self.trader_id = self.scope["user"].id
        self.group_name = f'{self.group_name_prefix}_transactions_{self.trader_id}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_new_transaction_alert(self, event):
        transaction_data = event['transaction_data']
        await self.send(
            text_data=json.dumps({
                'transaction_data': transaction_data
            })
        )

    async def update_transaction_status(self, data):
        transaction_id = data.get('transaction_id')
        new_status = data.get('new_status')

        if not await self.is_trader_authorized_for_transaction(transaction_id):
            await self.send(text_data=json.dumps({"error": "Unauthorized"}))
            return

        await self.change_transaction_status(transaction_id, new_status)

        updated_transaction = await self.get_transaction_data(transaction_id)
        await self.send(
            text_data=json.dumps({
                'transaction_data': updated_transaction
            })
        )

    @database_sync_to_async
    def is_trader_authorized_for_transaction(self, transaction_id):
        transaction = get_object_or_404(self.transaction_model, pk=transaction_id)
        return transaction.trader_id.id == self.trader_id

    @database_sync_to_async
    def change_transaction_status(self, transaction_id, new_status):
        transaction = get_object_or_404(self.transaction_model, pk=transaction_id)
        transaction.status = new_status
        transaction.save()

    @database_sync_to_async
    def get_transaction_data(self, transaction_id):
        transaction = self.transaction_model.objects.get(pk=transaction_id)
        return {
            "id": transaction.id,
            "status": transaction.get_status_display(),
        }


class ActiveInputTransactionConsumer(BaseTransactionConsumer):
    transaction_model = InputTransaction
    group_name_prefix = 'active_input'


class ActiveOutputTransactionConsumer(BaseTransactionConsumer):
    transaction_model = OutputTransaction
    group_name_prefix = 'active_output'
