from channels.generic.websocket import AsyncJsonWebsocketConsumer

from main.models import User
from main.services import (
    update_last_seen,
    handle_transaction,
    get_current_balance,
    get_active_transactions,
    settle_transaction,
    client_handle_transaction
)


class Consumer(AsyncJsonWebsocketConsumer):
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
            await self.send_json(
                content={
                    'action': 'current_balance',
                    'data': balance_data,
                }
            )
            if self.user.type == User.Type.TRADER:
                transactions_data = await get_active_transactions(self.user)
                await self.send_json(
                    content={
                        'action': 'active_transactions',
                        'data': transactions_data,
                    }
                )
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive_json(self, content, **kwargs):
        action = content.get('action')

        try:
            if action == 'ping':
                await update_last_seen(self.user)
            elif action == 'change_transaction_status':
                if self.user.type == User.Type.TRADER:
                    await handle_transaction(self.user, content)
                elif self.user.type == User.Type.MERCHANT:
                    await client_handle_transaction(self.user, content)
            elif action == 'settle_transaction':
                await settle_transaction(content)  # TODO:
        except Exception as e:
            await self.send_json(
                content={
                    "action": "error",
                    "data": f"{e}"
                }
            )

    async def send_transaction_to_user(self, event):
        transaction_data = event['transaction_data']
        await self.send_json(
            content={
                'action': 'updated_transaction_status',
                'data': transaction_data,
            }
        )

    async def send_balance_to_user(self, event):
        balance_data = event['balance_data']
        await self.send_json(
            content={
                'action': 'updated_balance',
                'data': balance_data
            }
        )

    async def send_transaction_to_client(self, event):
        transaction_data = event['transaction_data']
        await self.send_json(
            content={
                'action': 'updated_transaction_status',
                'data': transaction_data,
            }
        )
