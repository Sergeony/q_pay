# Generated by Django 4.2.7 on 2024-02-14 07:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_payment_client_bank_title'),
    ]

    operations = [
        migrations.RenameField(
            model_name='merchantintegrations',
            old_name='public_key',
            new_name='api_key',
        ),
        migrations.RenameField(
            model_name='merchantintegrations',
            old_name='private_key',
            new_name='secret_key',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='client_bank_title',
        ),
        migrations.AddField(
            model_name='payment',
            name='client_bank',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='main.bank'),
            preserve_default=False,
        ),
    ]
