import json

from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from main.models import Transaction


class Consumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.group_name = None
        self.user = None

    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_new_transaction_alert(self, event):
        transaction_data = event['transaction_data']
        await self.send(
            text_data=json.dumps({
                'action': 'new_transaction',
                'transaction_data': transaction_data,
            })
        )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'ping':
            await self.update_last_seen()
        elif action == 'update_transaction_status':
            await self.update_transaction_status(data)

    async def update_transaction_status(self, data):
        transaction_id = data.get('transaction_id')
        new_status = data.get('new_status')
        transaction_type = data.get('transaction_type')

        if transaction_type not in ('input', 'output'):
            await self.send(text_data=json.dumps({"error": "Invalid transaction type"}))
            return

        if await self.is_trader_authorized_for_transaction(transaction_id):
            await self.change_transaction_status(transaction_id, new_status)
            updated_transaction = await self.get_transaction_data(transaction_id)
            await self.send(text_data=json.dumps({
                'action': 'updated_transaction',
                'transaction_data': updated_transaction,
                'transaction_type': transaction_type,
            }))
        else:
            await self.send(text_data=json.dumps({"error": "Unauthorized"}))

    @database_sync_to_async
    def is_trader_authorized_for_transaction(self, transaction_id):
        transaction = get_object_or_404(Transaction, pk=transaction_id)
        return transaction.trader.id == self.user.id

    @database_sync_to_async
    def change_transaction_status(self, transaction_id, new_status):
        transaction = get_object_or_404(Transaction, pk=transaction_id)
        transaction.status = new_status
        transaction.save()

    @database_sync_to_async
    def get_transaction_data(self, transaction_id):
        transaction = Transaction.objects.get(pk=transaction_id)
        return {
            "id": str(transaction.id),
            "status": transaction.get_status_display(),
        }

    @database_sync_to_async
    def update_last_seen(self):
        self.user.last_seen = timezone.now()
        self.user.save()
