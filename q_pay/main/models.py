import uuid

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
        extra_fields.setdefault('user_type', User.UserTypes.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)


class Language(models.Model):
    title = models.CharField(max_length=50, unique=True)


class User(AbstractBaseUser, PermissionsMixin):
    class UserTypes(models.IntegerChoices):
        TRADER = 1, _("TRADER")
        MERCHANT = 2, _("MERCHANT")
        ADMIN = 3, _("ADMIN")

    user_type = models.PositiveSmallIntegerField(choices=UserTypes.choices, editable=False)
    email = models.EmailField(max_length=150, unique=True)
    is_activated = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    tz_offset_minutes = models.SmallIntegerField(default=0)
    last_seen = models.DateTimeField(default=None, null=True, blank=True)
    is_light_theme = models.BooleanField(default=True)
    language = models.ForeignKey(Language, on_delete=models.SET_DEFAULT, default=1)
    is_deleted = models.BooleanField(default=False)
    otp_base32 = models.CharField(max_length=255)

    is_staff = models.BooleanField(default=False, editable=False)

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


class Requisites(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT)
    title = models.CharField(max_length=50, default="")
    card_number = models.CharField(max_length=19, unique=True)
    cardholder_name = models.CharField(max_length=100)
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, null=True, blank=True)
    is_activated = models.BooleanField(default=False)
    automation_used = models.BooleanField(default=False)
    daily_limit = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    weekly_limit = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    monthly_limit = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    daily_turnover = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, editable=False)
    weekly_turnover = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, editable=False)
    monthly_turnover = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, editable=False)
    is_deleted = models.BooleanField(default=False)


class BaseTransaction(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    status = models.PositiveSmallIntegerField()
    trader = models.ForeignKey(User, on_delete=models.PROTECT, related_name="%(class)s")
    merchant = models.ForeignKey(User, on_delete=models.PROTECT, related_name="merchant_%(class)s")
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    requisites = models.ForeignKey(Requisites, on_delete=models.PROTECT)
    trader_usdt_rate = models.DecimalField(max_digits=5, decimal_places=2)
    exchange_usdt_rate = models.DecimalField(max_digits=5, decimal_places=2)
    automation_used = models.BooleanField(default=False)

    class Meta:
        abstract = True


class InputTransaction(BaseTransaction):
    class Status(models.IntegerChoices):
        PENDING_CLIENT_CONFIRMATION = 1, _("PENDING_CLIENT_CONFIRMATION")
        PENDING_TRADER_CONFIRMATION = 2, _("PENDING_TRADER_CONFIRMATION")
        AUTO_COMPLETED = 3, _("AUTO_COMPLETED")
        MANUALLY_COMPLETED = 4, _("MANUALLY_COMPLETED")
        EXPIRED = 5, _("EXPIRED")
        CANCELLED = 6, _("CANCELLED")
        DISPUTED = 7, _("DISPUTED")

    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING_CLIENT_CONFIRMATION)
    claimed_amount = models.DecimalField(max_digits=9, decimal_places=2, editable=False)
    actual_amount = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)


class OutputTransaction(BaseTransaction):
    class Status(models.IntegerChoices):
        PENDING_TRADER_CONFIRMATION = 1, _("PENDING_TRADER_CONFIRMATION")
        CONFIRMED = 2, _("CONFIRMED")
        MANUALLY_COMPLETED = 3, _("MANUALLY_COMPLETED")
        EXPIRED = 4, _("EXPIRED")
        CANCELLED = 5, _("CANCELLED")
        DISPUTED = 6, _("DISPUTED")

    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING_TRADER_CONFIRMATION)
    amount = models.DecimalField(max_digits=9, decimal_places=2, editable=False)
    bank = models.ForeignKey(Bank, on_delete=models.PROTECT, null=True, blank=True, editable=False)
    card_number = models.CharField(max_length=19, editable=False)
    receipt_url = models.CharField(max_length=255, unique=True, default="")


class PrevInputTransactionTrader(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT)
    transaction = models.ForeignKey(InputTransaction, on_delete=models.PROTECT)


class PrevOutputTransactionTrader(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT)
    transaction = models.ForeignKey(OutputTransaction, on_delete=models.PROTECT)


class Advertisement(models.Model):
    trader = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    trader_usdt_rate = models.DecimalField(max_digits=5, decimal_places=2)
    exchange_usdt_rate = models.DecimalField(max_digits=5, decimal_places=2)
    requisites = models.ForeignKey(Requisites, on_delete=models.PROTECT)
    is_activated = models.BooleanField(default=False)


class Deposit(models.Model):
    trader = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)


class Transfer(models.Model):
    class Status(models.IntegerChoices):
        PENDING = 1, _("PENDING")
        REJECTED = 2, _("REJECTED")
        COMPLETED = 3, _("COMPLETED")

    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING)
    wallet_address = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    merchant = models.ForeignKey(User, on_delete=models.PROTECT, related_name="%(app_label)s_%(class)s_related")
    admin = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)


class Withdraw(models.Model):
    admin = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    wallet_address = models.CharField(max_length=255)
    note = models.TextField()


class MerchantIntegrations(models.Model):
    merchant = models.ForeignKey(User, on_delete=models.PROTECT)
    site_url = models.CharField(max_length=255, unique=True)
    success_url = models.CharField(max_length=255, unique=True)
    failed_url = models.CharField(max_length=255, unique=True)
    callback_url = models.CharField(max_length=255, unique=True)
