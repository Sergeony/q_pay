# Generated by Django 4.2.10 on 2024-04-01 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('balance', '0005_alter_lastfetchedtrontransaction_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lastfetchedtrontransaction',
            name='value',
            field=models.DecimalField(decimal_places=3, max_digits=13),
        ),
    ]
