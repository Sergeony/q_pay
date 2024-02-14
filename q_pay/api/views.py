from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from main.models import Payment
from main.serializers import PaymentSerializer, PaymentUpdateSerializer
from main.services import notify_trader_with_new_payment
from .services import (
    get_eligible_traders,
    get_best_trader, get_trader_bank_details
)


class PaymentAPIView(APIView):
    def get(self, request, order_id=None):
        if order_id:
            payment = get_object_or_404(Payment, order_id=order_id, merchant=request.user)
            serializer = PaymentSerializer(payment)
        else:
            payments = Payment.objects.filter(merchant=request.user)
            serializer = PaymentSerializer(payments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, order_id):
        payment = get_object_or_404(Payment, order_id=order_id, merchant=request.user)
        serializer = PaymentUpdateSerializer(payment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        client_bank = request.data.get('client_bank')
        amount = request.data.get('amount')

        eligible_traders = get_eligible_traders(client_bank, amount)
        best_trader = get_best_trader(eligible_traders)
        if best_trader is None:
            return Response({"error": "No traders found"}, status=status.HTTP_404_NOT_FOUND)

        trader_bank_details = get_trader_bank_details(best_trader.id, client_bank)
        # TODO: implement requests in single db transaction

        combined_data = {
            **request.data,
            'trader': best_trader.id,
            'merchant': request.user.id,
            'trader_bank_details': trader_bank_details.id,
            'commission': 7,
        }

        serializer = PaymentSerializer(data=combined_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        notify_trader_with_new_payment(serializer.data['payment_id'])

        return Response(serializer.data, status=status.HTTP_201_CREATED)
