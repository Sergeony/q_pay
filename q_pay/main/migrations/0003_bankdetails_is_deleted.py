# Generated by Django 4.2.7 on 2024-02-11 18:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_ad_balance_balancehistory_bankdetails_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='bankdetails',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
