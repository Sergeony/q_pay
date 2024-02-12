from main.models import Transaction, User, BankDetails, TransactionRequest
from channels.layers import get_channel_layer
from main.serializers import TransactionSerializer
from asgiref.sync import async_to_sync

trader_id = 19
trader = User.objects.get(id=trader_id)
merchant = User.objects.get(id=3)
trader_bank_details = BankDetails.objects.get(id=3)

channel_layer = get_channel_layer()
group_name = f'user_{trader_id}'


def create_input_transaction():
	new_request = TransactionRequest.objects.create(
		request_type=TransactionRequest.Type.INDIVIDUAL,
		status=TransactionRequest.Status.PROCESSING,
	)
	new_transaction = Transaction.objects.create(
		request=new_request,
		trader=trader,
		merchant=merchant,
		trader_bank_details=trader_bank_details,
		status=Transaction.Status.PENDING,
		claimed_amount=100.00,
		trader_fee=2,
		admin_fee=4,
		expiry_time='2024-02-11T19:20:02+00:00',
		type=Transaction.Type.INPUT
	)

	message = {
		'type': 'send_new_transaction_alert',
		'transaction_data': TransactionSerializer(new_transaction).data
	}

	async_to_sync(channel_layer.group_send)(group_name, message)


def create_output_transaction():
	new_request = TransactionRequest.objects.create(
		request_type=TransactionRequest.Type.INDIVIDUAL,
		status=TransactionRequest.Status.PROCESSING,
	)
	new_transaction = Transaction.objects.create(
		request=new_request,
		trader=trader,
		merchant=merchant,
		trader_bank_details=trader_bank_details,
		status=Transaction.Status.PENDING,
		claimed_amount=100.00,
		trader_fee=2,
		admin_fee=4,
		expiry_time='2024-02-11T19:20:02+00:00',
		type=Transaction.Type.OUTPUT,
	)

	message = {
		'type': 'send_new_transaction_alert',
		'transaction_data': TransactionSerializer(new_transaction).data
	}

	async_to_sync(channel_layer.group_send)(group_name, message)


# from main.tests.test_new_input_transaction import create_output_transaction, create_input_transaction
