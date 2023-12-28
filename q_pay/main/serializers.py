from rest_framework import serializers

from .models import (
    Bank,
    Requisites,
    Advertisement,
    InputTransaction,
    OutputTransaction,
    Transfer,
    MerchantIntegrations,
    User
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


class OutputTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutputTransaction
        fields = ['transaction_id', 'status', 'trader_id', 'merchant_id', 'created_at',
                  'confirmed_at', 'finished_at', 'requisites_id', 'trader_usdt_rate',
                  'exchange_usdt_rate', 'automation_used', 'amount', 'bank_id', 'card_number', 'receipt_url']
        read_only_fields = ['transaction_id', 'created_at', 'confirmed_at', 'finished_at',
                            'trader_usdt_rate', 'exchange_usdt_rate', 'automation_used']


class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = ['id', 'status', 'wallet_address', 'amount', 'merchant_id', 'admin_id', 'created_at', 'finished_at']
        read_only_fields = ['id', 'status', 'merchant_id', 'admin_id', 'created_at', 'finished_at']


class MerchantIntegrationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MerchantIntegrations
        fields = ['id', 'merchant_id', 'site_url', 'success_url', 'failed_url', 'callback_url']
        read_only_fields = ['id', 'merchant_id']


class UserInfoSerializer(serializers.ModelSerializer):
    is_online = serializers.SerializerMethodField()
    total_transactions = serializers.IntegerField()
    balance = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'is_online', 'total_transactions', 'balance', 'is_activated']

    @staticmethod
    def get_is_online(obj):
        return obj.is_online

    @staticmethod
    def get_balance(obj):
        # TODO: implement
        return 1000


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_activated']

    def update(self, instance, validated_data):
        instance.is_activated = validated_data.get('is_activated', instance.is_active)
        instance.save()
        return instance


class InviteCodeSerializer(serializers.Serializer):
    user_type = serializers.ChoiceField(choices=User.UserTypes.choices)


class TransactionRedirectSerializer(serializers.Serializer):
    transaction_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)
    new_trader_id = serializers.IntegerField(min_value=1)
    transaction_type = serializers.ChoiceField(choices=['input', 'output'])

    @staticmethod
    def validate_new_trader_id(value):
        if not User.objects.filter(id=value, user_type=User.UserTypes.TRADER, is_deleted=False).exists():
            raise serializers.ValidationError("Trader with the specified ID was not found.")
        return value

    def validate_transaction_ids(self, values):
        transaction_type = self.initial_data.get('transaction_type')

        if transaction_type == 'input':
            if not InputTransaction.objects.filter(id__in=values).exists():
                raise serializers.ValidationError("Some of the specified input transactions were not found.")
        elif transaction_type == 'output':
            if not OutputTransaction.objects.filter(id__in=values).exists():
                raise serializers.ValidationError("Some of the specified output transactions were not found.")

        return values
