# Generated by Django 4.2.10 on 2024-04-04 08:59

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0018_delete_traderdeposit'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='deposit_note',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]