import uuid
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class UserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('type', User.Type.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

    def merchants(self):
        return self.filter(type=User.Type.MERCHANT)  # TODO: replace regular sets with these one and the one down here

    def traders(self):
        return self.filter(type=User.Type.TRADER)

    def admins(self):
        return self.filter(type=User.Type.ADMIN)


class User(AbstractBaseUser):
    class Type(models.IntegerChoices):
        TRADER = 1, _("trader")
        MERCHANT = 2, _("merchant")
        ADMIN = 3, _("admin")

    class Language(models.IntegerChoices):
        ENGLISH = 1, _("english")
        RUSSIAN = 2, _("russian")
        UKRAINIAN = 3, _("ukrainian")

    type = models.PositiveSmallIntegerField(choices=Type.choices)
    email = models.EmailField(max_length=150, unique=True)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    timezone = models.CharField(max_length=50, default='UTC')
    last_seen = models.DateTimeField(default=None, null=True, blank=True)
    is_light_theme = models.BooleanField(default=True)
    language = models.PositiveSmallIntegerField(choices=Language.choices, default=Language.ENGLISH)
    is_deleted = models.BooleanField(default=False)  # TODO: move soft delete from views here
    otp_base32 = models.CharField(max_length=32)
    last_login = None

    objects = UserManager()

    USERNAME_FIELD = "email"

    @property
    def is_online(self):
        if self.last_seen is None:
            return False
        return (timezone.now() - self.last_seen) < settings.USER_ONLINE_TIMEOUT


class Bank(models.Model):
    title = models.CharField(max_length=100, unique=True)
    icon_url = models.URLField(max_length=1024, unique=True)


class Ad(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT, related_name='ads')
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ('trader', 'bank')


class BankDetails(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT, related_name='bank_details')
    title = models.CharField(max_length=50, default="")
    card_number = models.CharField(max_length=19, unique=True)  # TODO: Add validation
    cardholder_name = models.CharField(max_length=100)
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, null=True, blank=True)
    is_active = models.BooleanField(default=False)
    use_automation = models.BooleanField(default=False)
    ad = models.ForeignKey(
        to=Ad,
        on_delete=models.SET_DEFAULT,
        related_name='bank_details',
        null=True,
        blank=True,
        default=None
    )
    is_deleted = models.BooleanField(default=False)  # TODO: move soft delete from views here
    daily_limit = models.DecimalField(max_digits=12, decimal_places=2)
    weekly_limit = models.DecimalField(max_digits=12, decimal_places=2)
    monthly_limit = models.DecimalField(max_digits=12, decimal_places=2)
    current_daily_turnover = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    current_weekly_turnover = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    current_monthly_turnover = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('trader', 'title')


class TransactionManager(models.Manager):
    def deposits(self):
        return self.filter(type=Transaction.Type.DEPOSIT)

    def withdrawals(self):
        return self.filter(type=Transaction.Type.WITHDRAWAL)


class Transaction(models.Model):
    class Status(models.IntegerChoices):
        REJECTED = 1, _("rejected")
        PENDING = 2, _("pending")
        CANCELLED = 3, _("cancelled")
        REVIEWING = 4, _("reviewing")
        DISPUTING = 5, _("disputing")
        COMPLETED = 6, _("completed")
        FAILED = 7, _("failed")
        PARTIAL = 8, _("partially_paid")
        REFUND_REQUESTED = 9, _("refund_requested")
        REFUNDING = 10, _("refunding")
        REFUNDED = 11, _('refunded')
        REFUND_FAILED = 12, _("refund_failed")
        REDIRECT = 13, _("REDIRECT")

    class Type(models.IntegerChoices):
        DEPOSIT = 1, _("deposit")
        WITHDRAWAL = 2, _("withdrawal")

    class Currency(models.IntegerChoices):
        UAH = 1, _("uah")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    order_id = models.CharField(max_length=255)
    type = models.PositiveSmallIntegerField(choices=Type.choices, db_index=True)
    trader = models.ForeignKey(
        to=User,
        on_delete=models.PROTECT,
        related_name='trader_transactions',
        blank=True,
        null=True
    )
    merchant = models.ForeignKey(User, on_delete=models.PROTECT, related_name='merchant_transactions')
    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    actual_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    trader_commission = models.PositiveSmallIntegerField(default=None, null=True, blank=True)
    # TODO: implement get commission
    service_commission = models.PositiveSmallIntegerField()
    # TODO: implement get commission
    currency = models.PositiveSmallIntegerField(choices=Currency.choices, default=Currency.UAH)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    finished_at = models.DateTimeField(blank=True, null=True)
    lifetime = models.DurationField(default=timedelta(minutes=15))  # TODO: implement lifetime
    trader_bank_details = models.ForeignKey(BankDetails, on_delete=models.PROTECT, null=True, blank=True)
    client_card_number = models.CharField(max_length=19, null=True, blank=True)
    client_bank = models.ForeignKey(Bank, on_delete=models.PROTECT)
    client_id = models.CharField(max_length=255)
    client_ip = models.GenericIPAddressField()
    use_automation = models.BooleanField(default=False)
    receipt_url = models.URLField(max_length=1024, null=True, blank=True, unique=True)
    old_trader: User = None

    objects = TransactionManager()


class TransactionStatusHistory(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='status_history')
    status = models.PositiveSmallIntegerField(choices=Transaction.Status.choices)
    changed_at = models.DateTimeField(auto_now_add=True)


class PrevTransactionTraders(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT)
    transaction = models.ForeignKey(Transaction, on_delete=models.PROTECT)

    class Meta:
        ordering = ['-transaction__created_at']
        unique_together = ('trader', 'transaction')


class TraderDeposit(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT, related_name='deposits', null=True, blank=True)
    blockchain_transaction = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class AdminWithdrawal(models.Model):
    admin = models.ForeignKey(User, on_delete=models.PROTECT, related_name='admin_withdrawals')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    wallet_address = models.CharField(max_length=255)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class MerchantWithdrawal(models.Model):
    class Status(models.IntegerChoices):
        PENDING = 1, _("pending")
        COMPLETED = 2, _("completed")
        DECLINED = 3, _("declined")

    merchant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='merchant_withdrawals')
    admin = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, related_name='handled_withdrawals')
    amount = models.DecimalField(max_digits=12, decimal_places=4)
    wallet_address = models.CharField(max_length=255)
    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)


class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='balance', null=True, blank=True)
    active_balance = models.DecimalField(
        max_digits=19,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    frozen_balance = models.DecimalField(
        max_digits=19,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    update_at = models.DateTimeField(auto_now=True)


class BalanceHistory(models.Model):
    class ChangeReason(models.IntegerChoices):
        CREATED = 0, _("Created")
        CORRECTION = 1, _("Correction")
        PAY_COMMISSION = 2, _("Commission")
        FREEZE_FOR_REFUND = 3, _("Reserved to Refund")
        RELEASE_AFTER_REFUND = 4, _("Release after Refund")
        FREEZE_FOR_TRANSACTION = 5, _("Freeze for transaction")
        RELEASE_AFTER_TRANSACTION = 6, _("Release for transaction")
        RETURN_PENALTY = 7, _("Return penalty")
        TAKE_AWAY_FOR_TRANSACTION = 8, _("Take away for transaction")
        GIVE_AWAY_FOR_TRANSACTION = 9, _("Give away for transaction")

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='balance_histories', null=True, blank=True)
    change_reason = models.PositiveSmallIntegerField(choices=ChangeReason.choices)
    change_active_balance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    change_frozen_balance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    new_frozen_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    new_active_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    changed_at = models.DateTimeField(auto_now_add=True)


class MerchantIntegrations(models.Model):
    merchant = models.OneToOneField(User, on_delete=models.PROTECT, related_name='integrations')
    result_url = models.CharField(max_length=255, unique=True)
    callback_url = models.CharField(max_length=255, unique=True)
    api_key = models.CharField(max_length=255, unique=True)
    secret_key = models.CharField(max_length=255)
