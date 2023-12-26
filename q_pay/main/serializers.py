from rest_framework import serializers

from .models import (
    Bank,
    Requisites,
    Advertisement,
    InputTransaction
)


class BanksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'title', 'icon_url']
        read_only_fields = ['id', 'title', 'icon_url']


class RequisitesSerializer(serializers.ModelSerializer):
    bank = BanksSerializer(read_only=True, source='bank_id')
    bank_id = serializers.PrimaryKeyRelatedField(queryset=Bank.objects.all(), write_only=True)

    class Meta:
        model = Requisites
        fields = [
            'id', 'title', 'card_number', 'cardholder_name', 'bank', 'bank_id',
            'is_activated', 'automation_used',
            'daily_limit', 'weekly_limit', 'monthly_limit',
            'daily_turnover', 'weekly_turnover', 'monthly_turnover'
        ]
        read_only_fields = [
            'id', 'bank', 'bank_id', 'daily_turnover', 'weekly_turnover', 'monthly_turnover'
        ]

    def update(self, instance, validated_data):
        updatable_fields = [
            'is_activated', 'automation_used', 'title'
        ]

        for field in updatable_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()
        return instance


class RequisitesForAdvertisementsSerializer(serializers.ModelSerializer):
    bank = BanksSerializer(source='bank_id')
    last_four_card_number = serializers.SerializerMethodField()

    @staticmethod
    def get_last_four_card_number(obj):
        return obj.card_number[-4:]

    class Meta:
        model = Requisites
        fields = [
            'id', 'title', 'automation_used', 'last_four_card_number', 'bank',
        ]


class AdvertisementsSerializer(serializers.ModelSerializer):
    requisites = RequisitesForAdvertisementsSerializer(read_only=True, source='requisites_id')
    requisites_id = serializers.PrimaryKeyRelatedField(queryset=Requisites.objects.all(), write_only=True)

    class Meta:
        model = Advertisement
        fields = [
            'id', 'created_at', 'trader_usdt_rate', 'exchange_usdt_rate',
            'requisites', 'requisites_id', 'is_activated',
        ]
        read_only_fields = [
            'id', 'created_at', 'requisites', 'requisites_id',
        ]

    def update(self, instance, validated_data):
        updatable_fields = [
            'is_activated',
        ]

        for field in updatable_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()
        return instance


class InputTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InputTransaction
        fields = ['transaction_id', 'status', 'trader_id', 'merchant_id', 'created_at',
                  'confirmed_at', 'finished_at', 'requisites_id', 'trader_usdt_rate',
                  'exchange_usdt_rate', 'automation_used', 'claimed_amount', 'actual_amount']
        read_only_fields = ['transaction_id', 'created_at', 'confirmed_at', 'finished_at',
                            'trader_usdt_rate', 'exchange_usdt_rate', 'automation_used']
