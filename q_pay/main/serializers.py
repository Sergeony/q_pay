from rest_framework import serializers

from .models import (
    Bank,
    MerchantIntegrations,
    User,
    BankDetails,
    Ad,
    Transaction,
    MerchantWithdrawal,
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


class AdSerializer(serializers.ModelSerializer):
    bank_details = BankDetailsSerializer(many=True, read_only=True)
    bank = BanksSerializer(read_only=True)
    bank_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Ad
        fields = ['id', 'bank', 'bank_id', 'created_at', 'updated_at', 'is_active', 'bank_details']


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
    def get_balance():
        # TODO: implement
        return 1000


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
    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ['id', 'amount_credit', 'amount_debit',
                            'completed_at', 'finished_at', 'created_at']
        extra_kwargs = {
            'trader': {'write_only': True},
            'merchant': {'write_only': True},
        }


class TransactionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        exclude = ['trader', 'merchant']
        read_only_fields = ['order_id', 'type', 'amount', 'currency', 'client_card_number', 'client_bank', 'client_id',
                            'client_ip', 'trader_bank_details', 'id', 'amount_credit', 'amount_debit',
                            'completed_at', 'finished_at', 'created_at', 'lifetime', 'commission']


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
