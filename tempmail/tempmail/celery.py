import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tempmail.settings')

from celery import Celery

app = Celery('tempmail')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    "clean-db-every-5-mins": {
        "task": "api.tasks.cleanup_messages",
        "schedule": 300,  # 5 minutes in seconds
    }
}
