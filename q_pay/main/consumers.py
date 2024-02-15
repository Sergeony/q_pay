import json

from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from main.models import Transaction, MerchantIntegrations
from api.tasks import notify_merchant_with_new_transaction_status
from main.serializers import TransactionSerializer, MerchantIntegrationsSerializer


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

        if await self.is_trader_authorized_for_transaction(transaction_id):
            await self.change_transaction_status(transaction_id, new_status)
            (updated_transaction_data, merchant_id) = await self.get_transaction_data(transaction_id)
            integration_data = await self.get_integration_data(merchant_id)
            notify_merchant_with_new_transaction_status(updated_transaction_data, integration_data)

            await self.send(text_data=json.dumps({
                'action': 'updated_transaction',
                'transaction_data': updated_transaction_data,
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

        # if new_status == Transaction.Status.DISPUTING:
        #     # Отправка уведомления администратору (реализуйте это в соответствии с вашими требованиями)
        #     pass
        # elif new_status == Transaction.Status.COMPLETED:
        #     transaction.finished_at = timezone.now()
        # transaction.save()
        # # Запись истории статуса
        # TransactionStatusHistory.objects.create(transaction=transaction, status=new_status, amount_credit=transaction.amount_credit,
        #                                     changed_by="trader")
        # return transaction

    @database_sync_to_async
    def get_transaction_data(self, transaction_id):
        transaction = Transaction.objects.get(pk=transaction_id)
        serializer = TransactionSerializer(transaction)
        return serializer.data, transaction.merchant.id

    @database_sync_to_async
    def get_integration_data(self, merchant_id: int):
        integration = MerchantIntegrations.objects.get(merchant_id=merchant_id)
        serializer = MerchantIntegrationsSerializer(integration)
        return serializer.data

    @database_sync_to_async
    def update_last_seen(self):
        self.user.last_seen = timezone.now()
        self.user.save()
