import base64
import json

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from main.models import User, MerchantIntegrations, Payment
from main.serializers import PaymentSerializer
from .services import verify_signature


class RequestAPIView(APIView):
    def post(self, request):
        encoded_data = request.data.get('data')
        decoded_data = base64.b64decode(encoded_data).decode()
        data = json.loads(decoded_data)

        public_key = data.get('public_key')
        if not public_key:
            return Response(data={"error": "Public key is missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            integration = MerchantIntegrations.objects.get(public_key=public_key)
        except MerchantIntegrations.DoesNotExist:
            return Response(data={"error": "Invalid public key"}, status=status.HTTP_404_NOT_FOUND)

        signature = request.data.get('signature')
        is_signature_valid = verify_signature(integration.private_key, encoded_data, signature)

        if not is_signature_valid:
            return Response(data={"error": "Invalid signature"}, status=status.HTTP_403_FORBIDDEN)

        merchant = integration.merchant
        action = data.get('action')
        if action == 'payment':
            return self.handle_payment(data)
        elif action == 'status':
            return self.handle_status(data, merchant)
        elif action == 'update':
            return self.handle_update(data, merchant)
        elif action == 'reports':
            return self.handle_reports(merchant)
        else:
            return Response({"error": "Unknown action"}, status=400)

    @staticmethod
    def handle_payment(data):
        serializer = PaymentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @staticmethod
    def handle_status(data, merchant: User):
        payment_id = data.get('payment_id')
        if payment_id:
            payment = get_object_or_404(Payment, pk=payment_id, merchant=merchant)
            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Payment id were not provided"}, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def handle_update(data, merchant: User):
        payment_id = data.get('payment_id')
        payment = get_object_or_404(Payment, pk=payment_id, merchant=merchant)
        serializer = PaymentSerializer(payment, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def handle_reports(merchant: User):
        payments = Payment.objects.filter(merchant=merchant)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
