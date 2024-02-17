# Generated by Django 4.2.7 on 2024-02-14 12:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_rename_public_key_merchantintegrations_api_key_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='amount',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payment',
            name='commission',
            field=models.PositiveSmallIntegerField(),
        ),
        migrations.AlterField(
            model_name='payment',
            name='currency',
            field=models.PositiveSmallIntegerField(choices=[(1, 'uah')], default=1),
        ),
        migrations.AlterField(
            model_name='payment',
            name='merchant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='merchant_payments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='payment',
            name='order_id',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='payment',
            name='payment_id',
            field=models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='payment',
            name='trader',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='trader_payments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='payment',
            name='type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'input'), (2, 'output')], db_index=True),
        ),
    ]
