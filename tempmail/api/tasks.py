import logging
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task
def cleanup_messages():
    from .models import MailBox

    expired_mailboxes = MailBox.objects.filter(expires_at__lt=timezone.now())
    count = expired_mailboxes.count()

    if count > 0:
        expired_mailboxes.delete()
        logger.info(f'Deleted {count} expired mailboxes')

    return f'Cleaned up {count} expired mailboxes'