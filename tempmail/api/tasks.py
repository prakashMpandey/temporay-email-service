import logging
from celery import shared_task
from django.utils import timezone
from django.db import transaction
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


@shared_task
def create_message(content,sender,receiver):
    import mailparser
    from .models import MailBox,Message
    
    parsed_mail=mailparser.parse_from_string(content)
    mail_subject=parsed_mail.mail_partial.get('subject','no subject')
    mail_body=parsed_mail.mail_partial.get('body','no body')

    receiver=MailBox.objects.filter(pk=receiver).first()

    if not receiver :
        return None;
    
    data={
            'subject':mail_subject,
            'body':mail_body,
            'sender':sender,
            'receiver':receiver
        }
    try:
       with transaction.atomic():
         message= Message.objects.create(
                                 receiver=data['receiver'],
                                sender=data['sender'],
                                subject=data['subject'],
                                body=data['body'])
         
        
         logger.info(f"new message received for {data['receiver']}")
         return 'message received '
    except Exception as e:
          logger.error(f"exception occured {e}")
          return None