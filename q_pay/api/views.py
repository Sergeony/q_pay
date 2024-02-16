from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from main.models import Transaction
from main.serializers import TransactionSerializer, TransactionUpdateSerializer
from .services import (
    get_eligible_traders,
    get_best_trader, get_trader_bank_details
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
        transaction = get_object_or_404(Transaction, order_id=order_id, merchant=request.user)
        serializer = TransactionUpdateSerializer(transaction, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        client_bank = request.data.get('client_bank')
        amount = request.data.get('amount')

        eligible_traders = get_eligible_traders(client_bank, amount)

        if not eligible_traders:
            serializer = TransactionSerializer(
                data={
                    **request.data,
                    'merchant': request.user.id,
                    'status': Transaction.Status.REJECTED,
                    'service_commission': 7,
                    'finished_at': timezone.now(),
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_404_NOT_FOUND)

        best_trader = get_best_trader(eligible_traders)
        trader_bank_details = get_trader_bank_details(best_trader.id, client_bank)
        # TODO: implement SQL queries in single db transaction

        serializer = TransactionSerializer(
            data={
                **request.data,
                'trader': best_trader.id,
                'merchant': request.user.id,
                'trader_bank_details': trader_bank_details.id,
                'service_commission': 7,  # TODO: implement
                'trader_commission': 3,
            }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
