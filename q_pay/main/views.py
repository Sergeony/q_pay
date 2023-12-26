from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status, viewsets

from .models import (
    Bank,
    Requisites,
    Advertisement
)
from .serializers import (
    BanksSerializer,
    RequisitesSerializer,
    AdvertisementsSerializer
)
from .permissions import IsTrader


class BankListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        banks = Bank.objects.all()
        serializer = BanksSerializer(banks, many=True)
        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


class RequisitesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsTrader]
    serializer_class = RequisitesSerializer

    def get_queryset(self):
        return Requisites.objects.filter(trader_id=self.request.user, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(trader_id=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response(
            data={"detail": "Requisites successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )


class AdvertisementsViewSet(viewsets.ModelViewSet):
    serializer_class = AdvertisementsSerializer
    permission_classes = [IsAuthenticated, IsTrader]

    def get_queryset(self):
        return Advertisement.objects.filter(trader_id=self.request.user)

    def perform_create(self, serializer):
        serializer.save(trader_id=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        super().destroy(self, request, *args, **kwargs)
        return Response(
            data={"detail": "Advertisement successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )
