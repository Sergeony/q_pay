# Generated by Django 4.2.7 on 2023-12-26 13:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_rename_is_active_advertisement_is_activated_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bank',
            name='icon_url',
            field=models.ImageField(unique=True, upload_to='bank_icons/'),
        ),
        migrations.AlterField(
            model_name='outputtransaction',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'PENDING_TRADER_CONFIRMATION'), (2, 'CONFIRMED'), (3, 'MANUALLY_COMPLETED'), (4, 'EXPIRED'), (5, 'CANCELLED'), (6, 'DISPUTED')], default=1),
        ),
        migrations.AlterField(
            model_name='transfer',
            name='admin_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]
