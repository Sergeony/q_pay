from rest_framework import serializers

from .models import (
    Bank,
    Requisites
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
