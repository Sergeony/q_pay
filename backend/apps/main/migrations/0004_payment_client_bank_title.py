# Generated by Django 4.2.7 on 2024-02-13 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_payment_finished_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='client_bank_title',
            field=models.CharField(blank=True, max_length=19, null=True),
        ),
    ]