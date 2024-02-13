import json

from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from main.models import Payment


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
        payment_type = data.get('payment_type')

        if payment_type not in ('input', 'output'):
            await self.send(text_data=json.dumps({"error": "Invalid payment type"}))
            return

        if await self.is_trader_authorized_for_payment(payment_id):
            await self.change_payment_status(payment_id, new_status)
            updated_payment = await self.get_payment_data(payment_id)
            await self.send(text_data=json.dumps({
                'action': 'updated_payment',
                'payment_data': updated_payment,
                'payment_type': payment_type,
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
        return {
            "id": str(payment.id),
            "status": payment.get_status_display(),
        }

    @database_sync_to_async
    def update_last_seen(self):
        self.user.last_seen = timezone.now()
        self.user.save()
