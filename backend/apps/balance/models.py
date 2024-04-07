from django.db import models

from apps.main.models import User


class Deposit(models.Model):
    hash = models.CharField(max_length=64, unique=True)
    amount = models.DecimalField(max_digits=15, decimal_places=6)
    created_at = models.DateTimeField()
    note = models.TextField(default="")
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="deposits", null=True, blank=True)
    fetched_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)
