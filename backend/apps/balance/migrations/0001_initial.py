# Generated by Django 4.2.10 on 2024-03-30 20:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LastFetchedTronTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tx_id', models.CharField(max_length=64)),
                ('timestamp', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]