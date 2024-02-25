from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.main.models import Transaction
from apps.main.serializers import (
    TransactionSerializer,
    APITransactionSerializer,
    ClientTransactionStatusUpdateSerializer
)
from apps.api.services import (
    get_eligible_traders_and_bank_details,
    get_best_trader_and_bank_details,
    get_client_ip,
)


class TransactionAPIView(APIView):
    def get(self, request, order_id=None):
        if order_id:
            transaction = get_object_or_404(Transaction, order_id=order_id, merchant=request.user)
            serializer = TransactionSerializer(transaction)
        else:
            transactions = Transaction.objects.filter(merchant=request.user)
            serializer = TransactionSerializer(transactions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, order_id):
        try:
            transaction = Transaction.objects.get(order_id=order_id, merchant=request.user)
        except Transaction.DoesNotExist:
            return Response(data='Invalid order_id', status=status.HTTP_400_BAD_REQUEST)

        serializer = ClientTransactionStatusUpdateSerializer(transaction, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        client_bank = request.data.get('client_bank_id')
        amount = request.data.get('amount')

        eligible_traders = get_eligible_traders_and_bank_details(client_bank, amount, check_balance=True)
        best_trader = get_best_trader_and_bank_details(eligible_traders)
        # TODO: implement SQL queries in single db transaction

        if not best_trader:
            serializer = APITransactionSerializer(
                data={
                    **request.data,
                    'merchant': request.user.id,
                    'status': Transaction.Status.REJECTED,
                    'service_commission': 7,
                    'finished_at': timezone.now(),
                    'client_ip': get_client_ip(request),
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(
                data={"error": "No eligible traders found or insufficient balance"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = APITransactionSerializer(
            data={
                **request.data,
                'trader': best_trader.id,
                'merchant': request.user.id,
                'trader_bank_details_id': best_trader.eligible_bank_details_id,
                'service_commission': 7,  # TODO: implement
                'trader_commission': 3,
                'client_ip': get_client_ip(request),
            }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
