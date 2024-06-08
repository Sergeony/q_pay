from django.db import models

from apps.main.models import User


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name="wallet")
    address = models.CharField(max_length=34)
    private_key = models.CharField(max_length=255)
