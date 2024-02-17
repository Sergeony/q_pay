import json

from channels.generic.websocket import AsyncWebsocketConsumer

from main.models import User
from main.services import (
    update_last_seen,
    handle_transaction,
    get_current_balance,
    get_active_transactions,
    settle_transaction
)


class Consumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.group_name = None
        self.user = None

    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            if self.user.type == User.Type.ADMIN:
                self.group_name = f'admin'
            else:
                self.group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
            balance_data = await get_current_balance(self.user)
            await self.send(
                text_data=json.dumps({
                    'action': 'current_balance',
                    'transaction_data': balance_data,
                })
            )
            if self.user.type == User.Type.TRADER:
                transactions_data = await get_active_transactions(self.user)
                await self.send(
                    text_data=json.dumps({
                        'action': 'active_transactions',
                        'transaction_data': transactions_data,
                    })
                )
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        data: dict = json.loads(text_data)
        action = data.get('action')

        try:
            if action == 'ping':
                await update_last_seen(self.user)
            elif action == 'change_transaction_status':
                await handle_transaction(self.user, data)
            elif action == 'settle_transaction':
                await settle_transaction(data)  # TODO:
        except Exception as e:
            await self.send(text_data=json.dumps({"error": f"{e}"}))

    async def send_transaction_to_user(self, event):
        transaction_data = event['transaction_data']
        await self.send(
            text_data=json.dumps({
                'action': 'updated_transaction_status',
                'transaction_data': transaction_data,
            })
        )

    async def send_balance_to_user(self, event):
        balance_data = event['balance_data']
        await self.send(
            text_data=json.dumps({
                'action': 'updated_balance',
                'balance_data': balance_data
            })
        )
