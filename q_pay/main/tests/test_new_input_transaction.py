from main.models import InputTransaction, User, Requisites, OutputTransaction
from channels.layers import get_channel_layer
from main.serializers import InputTransactionSerializer, OutputTransactionSerializer
from asgiref.sync import async_to_sync

trader_id = 19
trader = User.objects.get(id=trader_id)
merchant = User.objects.get(id=3)
requisites = Requisites.objects.get(id=11)

channel_layer = get_channel_layer()
group_name = f'user_{trader_id}'


def create_input_transaction():
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

	message = {
		'type': 'send_new_transaction_alert',
		'transaction_data': InputTransactionSerializer(new_transaction).data
	}

	async_to_sync(channel_layer.group_send)(group_name, message)


def create_output_transaction():
	new_transaction = OutputTransaction.objects.create(
		trader=trader,
		merchant=merchant,
		requisites=requisites,
		status=InputTransaction.Status.PENDING_CLIENT_CONFIRMATION,
		claimed_amount=100.00,
		trader_usdt_rate=1.01,
		exchange_usdt_rate=1.00,
		automation_used=False
	)

	message = {
		'type': 'send_new_transaction_alert',
		'transaction_data': OutputTransactionSerializer(new_transaction).data
	}

	async_to_sync(channel_layer.group_send)(group_name, message)


# from main.tests.test_new_input_transaction import create_output_transaction, create_input_transaction
