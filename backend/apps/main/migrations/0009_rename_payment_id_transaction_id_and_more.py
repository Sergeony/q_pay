# Generated by Django 4.2.7 on 2024-02-15 11:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_transaction_transactionstatushistory_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='payment_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='transactionstatushistory',
            old_name='payment',
            new_name='transaction',
        ),
        migrations.AlterField(
            model_name='transaction',
            name='merchant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='merchant_transactions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='receipt_url',
            field=models.URLField(blank=True, max_length=1024, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='trader',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='trader_transactions', to=settings.AUTH_USER_MODEL),
        ),
    ]
