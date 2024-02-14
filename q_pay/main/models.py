import uuid
from datetime import timedelta

from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
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


class User(AbstractBaseUser):
    class Type(models.IntegerChoices):
        TRADER = 1, _("trader")
        MERCHANT = 2, _("merchant")
        ADMIN = 3, _("admin")

        def __repr__(self):
            return 'user type'

    class Language(models.IntegerChoices):
        ENGLISH = 1, _("english")
        RUSSIAN = 2, _("russian")
        UKRAINIAN = 3, _("ukrainian")

        def __repr__(self):
            return 'user language'

    type = models.PositiveSmallIntegerField(choices=Type.choices)
    email = models.EmailField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    timezone = models.CharField(max_length=50, default='UTC')
    last_seen = models.DateTimeField(default=None, null=True, blank=True)
    last_login = None
    is_light_theme = models.BooleanField(default=True)
    language = models.PositiveSmallIntegerField(choices=Language.choices, default=Language.ENGLISH)
    is_deleted = models.BooleanField(default=False)  # TODO: move soft delete from views here
    otp_base32 = models.CharField(max_length=32)

    objects = UserManager()

    USERNAME_FIELD = "email"

    @property
    def is_online(self):
        if self.last_seen is None:
            return False
        return (timezone.now() - self.last_seen) < settings.USER_ONLINE_TIMEOUT


class Bank(models.Model):
    title = models.CharField(max_length=100, unique=True)
    icon_url = models.ImageField(upload_to='bank_icons/', unique=True)

    def __str__(self):
        return self.title


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
    card_number = models.CharField(max_length=19, unique=True)
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


class Payment(models.Model):
    class Status(models.IntegerChoices):
        REJECTED = 1, _("rejected")
        PENDING = 2, _("pending")
        CANCELLED = 3, _("cancelled")
        REVIEWING = 4, _("reviewing")
        DISPUTING = 5, _("disputing")
        COMPLETED = 6, _("completed")
        FAILED = 7, _("failed")
        REFUND = 8, _("refund")
        PARTIALLY_PAID = 9, _("partially_paid")

        def __repr__(self):
            return 'payment status'

    class Type(models.IntegerChoices):
        INPUT = 1, _("input")
        OUTPUT = 2, _("output")

        def __repr__(self):
            return 'payment type'

    class Currency(models.IntegerChoices):
        UAH = 1, _("uah")

        def __repr__(self):
            return 'payment currency'

    payment_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    order_id = models.CharField(max_length=255)
    type = models.PositiveSmallIntegerField(choices=Type.choices, db_index=True)
    trader = models.ForeignKey(User, on_delete=models.PROTECT, related_name='trader_payments')
    merchant = models.ForeignKey(User, on_delete=models.PROTECT, related_name='merchant_payments')
    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_debit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_credit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission = models.PositiveSmallIntegerField()  # TODO: implement get commission
    currency = models.PositiveSmallIntegerField(choices=Currency.choices, default=Currency.UAH)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    finished_at = models.DateTimeField(blank=True, null=True)
    lifetime = models.DurationField(default=timedelta(minutes=15))  # TODO: implement lifetime
    trader_bank_details = models.ForeignKey(BankDetails, on_delete=models.PROTECT)
    client_card_number = models.CharField(max_length=19, null=True, blank=True)
    client_bank = models.ForeignKey(Bank, on_delete=models.PROTECT)
    client_id = models.CharField(max_length=255)
    client_ip = models.GenericIPAddressField()

    def __str__(self):
        return self.payment_id


class PaymentStatusHistory(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='status_history')
    status = models.PositiveSmallIntegerField(choices=Payment.Status.choices)
    amount_credit = models.DecimalField(max_digits=10, decimal_places=2)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.CharField(max_length=255, blank=True, null=True)


class Refund(models.Model):
    class Status(models.IntegerChoices):
        REQUESTED = 1, _("requested")
        PENDING = 2, _("pending")
        COMPLETED = 3, _("completed")
        FAILED = 4, _("failed")

    payment = models.OneToOneField(Payment, on_delete=models.PROTECT, editable=False, related_name='refund')
    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.REQUESTED)
    requested_at = models.DateTimeField(auto_now=True, editable=False)

    completed_at = models.DateTimeField(null=True, blank=True)
    client_card_number = models.CharField(max_length=19)
    client_bank = models.ForeignKey(Bank, on_delete=models.PROTECT, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False)


class PrevPaymentTrader(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT)
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT)


class TraderDeposit(models.Model):
    blockchain_transaction_id = models.CharField(max_length=255, unique=True)
    trader = models.ForeignKey(User, on_delete=models.PROTECT, related_name='deposits', null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class AdminWithdrawal(models.Model):
    admin = models.ForeignKey(User, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    wallet_address = models.CharField(max_length=255)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class MerchantWithdrawal(models.Model):
    class Status(models.IntegerChoices):
        PENDING = 1, _("pending")
        COMPLETED = 2, _("completed")
        DECLINED = 3, _("declined")

        def __repr__(self):
            return 'merchant withdrawal status'

    merchant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    admin = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=4)
    wallet_address = models.CharField(max_length=255)
    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)


class Balance(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    active_balance = models.DecimalField(max_digits=19, decimal_places=2)
    frozen_balance = models.DecimalField(max_digits=19, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.email} Balance"


class BalanceHistory(models.Model):
    class ChangeReason(models.IntegerChoices):
        PENDING = 1, _("Deposit")
        COMPLETED = 2, _("Withdrawal")
        DISPUTED = 3, _("Payment")
        CORRECTION = 4, _("Correction")

        def __repr__(self):
            return 'balance history change reason'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='balance_histories')
    balance_change = models.DecimalField(max_digits=12, decimal_places=2)
    new_balance = models.DecimalField(max_digits=12, decimal_places=2)
    change_reason = models.PositiveSmallIntegerField(choices=ChangeReason.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    payment = models.ForeignKey(to=Payment, on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} balance change on {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"


class MerchantIntegrations(models.Model):
    merchant = models.OneToOneField(User, on_delete=models.PROTECT, related_name='integrations')
    result_url = models.CharField(max_length=255, unique=True)
    callback_url = models.CharField(max_length=255, unique=True)

    api_key = models.CharField(max_length=255, unique=True)
    secret_key = models.CharField(max_length=255)
