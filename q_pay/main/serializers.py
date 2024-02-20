from decimal import Decimal

from django.db.transaction import atomic
from rest_framework import serializers

from .models import (
    Bank,
    MerchantIntegrations,
    User,
    BankDetails,
    Ad,
    Transaction,
    MerchantWithdrawal,
    Balance,
)


class BanksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'title', 'icon_url']
        read_only_fields = ['id', 'title', 'icon_url']


class BankDetailsSerializer(serializers.ModelSerializer):
    bank = BanksSerializer(read_only=True)
    bank_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = BankDetails
        fields = ['id', 'title', 'card_number', 'cardholder_name', 'bank', 'bank_id',
                  'is_active', 'use_automation',
                  'daily_limit', 'weekly_limit', 'monthly_limit',
                  'current_daily_turnover', 'current_weekly_turnover', 'current_monthly_turnover',
                  ]

    def update(self, instance, validated_data):
        is_active = validated_data.get('is_active')
        if is_active is not None:
            instance.is_active = is_active
            instance.save()
        return instance


class BankDetailsForAdSerializer(serializers.ModelSerializer):
    last_four_card_number = serializers.SerializerMethodField()

    @staticmethod
    def get_last_four_card_number(obj):
        return obj.card_number[-4:]

    class Meta:
        model = BankDetails
        fields = ['id', 'title', 'last_four_card_number', 'use_automation']
        read_only_fields = ['id', 'title', 'last_four_card_number', 'use_automation']


class AdSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    bank = BanksSerializer(read_only=True)
    bank_id = serializers.IntegerField(write_only=True)
    is_active = serializers.BooleanField(required=False)
    bank_details = BankDetailsForAdSerializer(many=True, read_only=True)
    attach_ids = serializers.ListField(write_only=True, child=serializers.IntegerField(), required=False)
    detach_ids = serializers.ListField(write_only=True, child=serializers.IntegerField(), required=False)

    class Meta:
        model = Ad
        fields = ['id', 'bank', 'bank_id', 'is_active', 'bank_details', 'attach_ids', 'detach_ids']

    def create(self, validated_data):
        attach_ids = validated_data.pop('attach_ids', None)

        with atomic():
            ad = Ad.objects.create(**validated_data)
            if attach_ids:
                BankDetails.objects.filter(
                    id__in=attach_ids, bank=ad.bank, trader=ad.trader
                ).update(ad=ad)
        return ad

    def update(self, instance: Ad, validated_data):
        is_active = validated_data.get('is_active')
        attach_ids = validated_data.get('attach_ids')
        detach_ids = validated_data.get('detach_ids')

        with atomic():
            if is_active is not None:
                instance.is_active = is_active
                instance.save()
            if attach_ids:
                BankDetails.objects.filter(
                    id__in=attach_ids, bank=instance.bank, trader=instance.trader
                ).update(ad=instance)
            if detach_ids:
                BankDetails.objects.filter(
                    id__in=detach_ids, ad=instance, trader=instance.trader
                ).update(ad=None)
        return instance


class MerchantWithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MerchantWithdrawal
        fields = ['id', 'status', 'wallet_address', 'amount', 'merchant', 'admin', 'created_at', 'finished_at']
        read_only_fields = ['id', 'status', 'merchant', 'admin', 'created_at', 'finished_at']


class MerchantIntegrationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MerchantIntegrations
        fields = ['id', 'merchant', 'result_url', 'callback_url', 'api_key', 'secret_key']
        read_only_fields = ['id', 'merchant', 'api_key', 'secret_key']


class UserInfoSerializer(serializers.ModelSerializer):
    is_online = serializers.SerializerMethodField()
    total_transactions = serializers.IntegerField(read_only=True)
    balance = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'is_online', 'total_transactions', 'balance', 'is_active']

    @staticmethod
    def get_is_online(obj):
        return obj.is_online

    @staticmethod
    def get_balance(obj: User):  # TODO: optimize SQL queries and move it to separate serializer
        balance = Balance.objects.get(user=obj)
        return {
            "active": balance.active_balance,
            "frozen": balance.frozen_balance,
        }


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']

    def update(self, instance, validated_data):
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance


class InviteCodeSerializer(serializers.Serializer):
    user_type = serializers.ChoiceField(choices=User.Type.choices)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['language', 'timezone', 'is_light_theme', 'is_active']


class TransactionSerializer(serializers.ModelSerializer):
    trader_bank_details = BankDetailsForAdSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ['trader_bank_details', 'actual_amount', 'completed_at',
                            'finished_at', 'created_at']


class APITransactionSerializer(serializers.ModelSerializer):
    card_number = serializers.SerializerMethodField()
    amount_to_deposit = serializers.SerializerMethodField()
    trader_bank_details_id = serializers.IntegerField(write_only=True, required=False)
    client_bank = BanksSerializer(read_only=True)
    client_bank_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Transaction
        fields = [
            'card_number', 'completed_at', 'amount_to_deposit', 'finished_at', 'created_at', 'lifetime', 'id',
            'type', 'order_id', 'client_id',
            'status', 'actual_amount', 'amount', 'client_bank',
            'trader_commission', 'service_commission', 'trader_bank_details_id', 'trader', 'merchant', 'client_ip',
            'client_bank_id',
        ]
        extra_kwargs = {
            'trader': {'write_only': True},
            'merchant': {'write_only': True},
            'trader_commission': {'write_only': True},
            'service_commission': {'write_only': True},
            'trader_bank_details_id': {'write_only': True},
            'client_ip': {'write_only': True},
        }
        read_only_fields = ['card_number', 'completed_at', 'finished_at', 'created_at', 'lifetime', 'id']

    @staticmethod
    def get_card_number(obj):
        return obj.trader_bank_details.card_number

    @staticmethod
    def get_amount_to_deposit(obj):
        return float(obj.amount * Decimal((100 - obj.trader_commission - obj.service_commission) / 100))


class TransactionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        exclude = ['trader', 'merchant']
        read_only_fields = ['order_id', 'type', 'amount', 'currency', 'client_card_number', 'client_bank', 'client_id',
                            'client_ip', 'trader_bank_details', 'id', 'amount', 'actual_amount',
                            'completed_at', 'finished_at', 'created_at', 'lifetime', 'trader_commission']


class TransactionRedirectSerializer(serializers.Serializer):
    transaction_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)
    new_trader_id = serializers.IntegerField(min_value=1)

    @staticmethod
    def validate_new_trader_id(value):
        if not User.objects.filter(id=value, type=User.Type.TRADER, is_deleted=False).exists():
            raise serializers.ValidationError("Trader with the specified ID was not found.")
        return value

    @staticmethod
    def validate_transaction_ids(values):
        if not Transaction.objects.filter(id__in=values).exists():
            raise serializers.ValidationError(f"Some of the specified transactions were not found.")

        return values


class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = ['active_balance', 'frozen_balance']
        read_only_fields = ['active_balance', 'frozen_balance']


class ClientTransactionStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['status']

    def validate(self, attrs):
        current_status = self.instance.status
        transaction_type = self.instance.type
        new_status = attrs.get('status')

        if transaction_type == Transaction.Type.DEPOSIT and current_status != Transaction.Status.PENDING:
            raise serializers.ValidationError("DEPOSIT transactions must be in PENDING status to be updated.")
        if transaction_type == Transaction.Type.DEPOSIT and new_status not in [Transaction.Status.CANCELLED,
                                                                               Transaction.Status.REVIEWING]:
            print("TYPE: ", transaction_type, "NEW STATUS: ", new_status)
            raise serializers.ValidationError("DEPOSIT transactions can only be updated to CANCELLED or REVIEWING.")

        if transaction_type == Transaction.Type.WITHDRAWAL and current_status != Transaction.Status.REVIEWING:
            raise serializers.ValidationError("WITHDRAWAL transactions must be in REVIEWING status to be updated.")
        if transaction_type == Transaction.Type.WITHDRAWAL and new_status not in [Transaction.Status.DISPUTING,
                                                                                  Transaction.Status.COMPLETED]:
            raise serializers.ValidationError("WITHDRAWAL transactions can only be updated to DISPUTE or COMPLETED.")

        return attrs
