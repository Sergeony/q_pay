import json

from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from main.models import Payment, MerchantIntegrations
from api.tasks import notify_merchant_with_new_payment_status
from main.serializers import PaymentSerializer, MerchantIntegrationsSerializer


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

    async def send_new_payment_alert(self, event):
        payment_data = event['payment_data']
        await self.send(
            text_data=json.dumps({
                'action': 'new_payment',
                'payment_data': payment_data,
            })
        )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'ping':
            await self.update_last_seen()
        elif action == 'update_payment_status':
            await self.update_payment_status(data)

    async def update_payment_status(self, data):
        payment_id = data.get('payment_id')
        new_status = data.get('new_status')

        if await self.is_trader_authorized_for_payment(payment_id):
            await self.change_payment_status(payment_id, new_status)
            (updated_payment_data, merchant_id) = await self.get_payment_data(payment_id)
            integration_data = await self.get_integration_data(merchant_id)
            notify_merchant_with_new_payment_status(updated_payment_data, integration_data)

            await self.send(text_data=json.dumps({
                'action': 'updated_payment',
                'payment_data': updated_payment_data,
            }))
        else:
            await self.send(text_data=json.dumps({"error": "Unauthorized"}))

    @database_sync_to_async
    def is_trader_authorized_for_payment(self, payment_id):
        payment = get_object_or_404(Payment, pk=payment_id)
        return payment.trader.id == self.user.id

    @database_sync_to_async
    def change_payment_status(self, payment_id, new_status):
        payment = get_object_or_404(Payment, pk=payment_id)
        payment.status = new_status
        payment.save()

    @database_sync_to_async
    def get_payment_data(self, payment_id):
        payment = Payment.objects.get(pk=payment_id)
        serializer = PaymentSerializer(payment)
        return serializer.data, payment.merchant.id

    @database_sync_to_async
    def get_integration_data(self, merchant_id: int):
        integration = MerchantIntegrations.objects.get(merchant_id=merchant_id)
        serializer = MerchantIntegrationsSerializer(integration)
        return serializer.data

    @database_sync_to_async
    def update_last_seen(self):
        self.user.last_seen = timezone.now()
        self.user.save()
