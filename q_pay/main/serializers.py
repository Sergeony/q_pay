from rest_framework import serializers

from .models import (
    Bank,
    MerchantIntegrations,
    User,
    BankDetails,
    Ad,
    Payment,
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
                  'start_daily_turnover', 'start_weekly_turnover', 'start_monthly_turnover',
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
        fields = ['id', 'merchant', 'result_url', 'callback_url', 'private_key', 'public_key']
        read_only_fields = ['id', 'merchant', 'public_key', 'private_key']


class UserInfoSerializer(serializers.ModelSerializer):
    is_online = serializers.SerializerMethodField()
    total_payments = serializers.IntegerField(read_only=True)
    balance = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'is_online', 'total_payments', 'balance', 'is_active']

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


class PaymentSerializer(serializers.ModelSerializer):
    trader_bank_details = BankDetailsSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = "__all__"


class PaymentRedirectSerializer(serializers.Serializer):
    payment_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)
    new_trader_id = serializers.IntegerField(min_value=1)
    payment_type = serializers.ChoiceField(choices=['input', 'output'])

    @staticmethod
    def validate_new_trader_id(value):
        if not User.objects.filter(id=value, user_type=User.Type.TRADER, is_deleted=False).exists():
            raise serializers.ValidationError("Trader with the specified ID was not found.")
        return value

    def validate_payment_ids(self, values):
        payment_type = self.initial_data.get('payment_type')

        if not Payment.objects.filter(id__in=values, type=payment_type).exists():
            raise serializers.ValidationError(f"Some of the specified {payment_type} payments were not found.")

        return values
