# Generated by Django 4.2.7 on 2024-02-16 06:30

from decimal import Decimal
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_rename_payment_id_transaction_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ServiceBalance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.DecimalField(decimal_places=2, max_digits=12)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.RenameModel(
            old_name='PrevTransactionTrader',
            new_name='PrevTransactionTraders',
        ),
        migrations.RemoveField(
            model_name='refund',
            name='client_bank',
        ),
        migrations.RemoveField(
            model_name='refund',
            name='transaction',
        ),
        migrations.AlterModelOptions(
            name='prevtransactiontraders',
            options={'ordering': ['-transaction__created_at']},
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='commission',
            new_name='service_commission',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='amount_credit',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='amount_debit',
        ),
        migrations.RemoveField(
            model_name='transactionstatushistory',
            name='amount_credit',
        ),
        migrations.RemoveField(
            model_name='transactionstatushistory',
            name='changed_by',
        ),
        migrations.AddField(
            model_name='balance',
            name='update_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='transaction',
            name='actual_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('0.00'))]),
        ),
        migrations.AddField(
            model_name='transaction',
            name='trader_commission',
            field=models.PositiveSmallIntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name='adminwithdrawal',
            name='admin',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='admin_withdrawals', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='balance',
            name='active_balance',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=19),
        ),
        migrations.AlterField(
            model_name='balance',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='balance', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='merchantwithdrawal',
            name='admin',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='handled_withdrawals', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='merchantwithdrawal',
            name='merchant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='merchant_withdrawals', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='amount',
            field=models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))]),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'rejected'), (2, 'pending'), (3, 'cancelled'), (4, 'reviewing'), (5, 'disputing'), (6, 'completed'), (7, 'failed'), (8, 'partially_paid'), (9, 'refund_requested'), (10, 'refunding'), (11, 'refunded'), (12, 'refund_failed'), (13, 'REDIRECT')], default=2),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='trader',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='trader_transactions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='trader_bank_details',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='main.bankdetails'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='type',
            field=models.PositiveSmallIntegerField(choices=[(1, 'deposit'), (2, 'withdrawal')], db_index=True),
        ),
        migrations.AlterField(
            model_name='transactionstatushistory',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'rejected'), (2, 'pending'), (3, 'cancelled'), (4, 'reviewing'), (5, 'disputing'), (6, 'completed'), (7, 'failed'), (8, 'partially_paid'), (9, 'refund_requested'), (10, 'refunding'), (11, 'refunded'), (12, 'refund_failed'), (13, 'REDIRECT')]),
        ),
        migrations.AlterUniqueTogether(
            name='prevtransactiontraders',
            unique_together={('trader', 'transaction')},
        ),
        migrations.DeleteModel(
            name='BalanceHistory',
        ),
        migrations.DeleteModel(
            name='Refund',
        ),
    ]