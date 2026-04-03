from  api.models import Message,MailBox
from django.core.management.base import BaseCommand
import asyncio
from aiosmtpd.controller import Controller
from django.shortcuts import get_object_or_404
import mailparser
from asgiref.sync import sync_to_async
from django.db import transaction
from django.utils import timezone
from api.tasks import create_message
class smtpHandler:

     

     async def handle_RCPT(self, server, session, envelope, address, rcpt_options):
     #    if not address.endswith('pmpandey.me'):
     #         return '550 not relying with the domain'

        receiver = await sync_to_async(self.get_mailbox)(address)
        if not receiver or receiver==None:
            return '550 '
        envelope.rcpt_tos.append(receiver.id)
        return '250 OK'
    

     async def handle_DATA(self, server, session, envelope):
  
      #   if not envelope or envelope.mail_from:
      #        print('error ho rha h yaha pe',envelope.mail_from , envelope['mail_from'],envelope.get('mail_from'))
      #        return '550 no mail id found'
        
        receiver = envelope.rcpt_tos[0]
        content=envelope.content.decode('utf-8',errors='replace')
        sender=envelope.mail_from
        create_message.delay(content,sender,receiver)
        return '250 OK done'
        

     def get_mailbox(self, email):
       return MailBox.objects.filter(email_id=email,expires_at__gt=timezone.now()).first()
   




class Command(BaseCommand):
    
     def handle(self,*args,**kwargs):
       controller=Controller(smtpHandler(),hostname='127.0.0.1',port=1025)
       print('starting smtp server')
       controller.start()
       try:
              asyncio.get_event_loop().run_forever()

       except KeyboardInterrupt:
              controller.stop();