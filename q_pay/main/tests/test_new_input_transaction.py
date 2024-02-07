from main.models import InputTransaction, User, Requisites
from channels.layers import get_channel_layer
from main.serializers import InputTransactionSerializer
from asgiref.sync import async_to_sync

trader = User.objects.get(id=19)
merchant = User.objects.get(id=3)
requisites = Requisites.objects.get(id=11)

new_transaction = InputTransaction.objects.create(
    trader=trader,
    merchant=merchant,
    requisites=requisites,
    status=InputTransaction.Status.PENDING_CLIENT_CONFIRMATION,
    claimed_amount=100.00,
    trader_usdt_rate=1.01,
    exchange_usdt_rate=1.00,
    automation_used=False
)


channel_layer = get_channel_layer()
group_name = 'user_19'

message = {
    'type': 'send_new_transaction_alert',
    'transaction_data': InputTransactionSerializer(new_transaction).data
}


def perform():
    async_to_sync(channel_layer.group_send)(
        group_name,
        message
    )

# from main.tests.test_new_input_transaction import perform

