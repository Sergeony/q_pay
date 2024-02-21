import os

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'q_pay.settings')


app = Celery('q_pay')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
