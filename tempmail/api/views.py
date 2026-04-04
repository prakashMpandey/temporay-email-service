from django.shortcuts import render
from rest_framework.decorators import api_view,throttle_classes
from .utils import create_unique_email
from rest_framework.response import Response
from rest_framework import status
from .models import MailBox,Message
from .serializers import MessageSerializer,MessageListSerializer
from django.utils import timezone
from rest_framework import generics
from rest_framework.throttling import AnonRateThrottle
import logging
from rest_framework.throttling import AnonRateThrottle


logger=logging.getLogger('api_logger')



class CreateEmailRateThrottle(AnonRateThrottle):
    scope = 'email_creation_limit'


@api_view(['GET'])
@throttle_classes([CreateEmailRateThrottle])
def get_new_email(request):
  
  email_address=create_unique_email()
  if email_address is None:
     logger.error('Failed to create unique email: generator returned None')
     return Response({"message":"email cannot be generated"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
  email= MailBox.objects.create(email_id=email_address)

  logger.info(f"New mailbox created: {email_address}")

  return Response({'email':email.email_id},status=status.HTTP_200_OK)


@api_view(['POST'])
@throttle_classes([AnonRateThrottle])  
def get_all_messages(request):
    if request.method=='POST':
        
        email=request.data.get('email')

        if not email:
           logger.warning("get_all_messages called without email address")
           return Response({'error':"email not found"},status=status.HTTP_400_BAD_REQUEST)
        
        mailBox=MailBox.objects.filter(email_id=email).first()
        
        if not mailBox :
           logger.warning(f"Access attempt for non-existent mailbox: {email}")
           return Response({'message':"no session exists"},status=status.HTTP_404_NOT_FOUND)
        

        if  mailBox.expires_at<=timezone.now():
           logger.info(f"Access attempt for expired email: {email}")
           return Response({'message':"email expired"},status=status.HTTP_410_GONE)
      

        messages=mailBox.messages.all().order_by('-created_at')

        if not messages.count():
           return Response({'data':[]},status=status.HTTP_200_OK)
        
        serializer=MessageListSerializer(messages,many=True)
        logger.debug(f"Retrieved {messages.count()} messages for {email}")

        return Response({'data':serializer.data},status=status.HTTP_200_OK)


class get_message(generics.RetrieveAPIView):
   queryset=Message.objects.all()
   serializer_class=MessageSerializer
   throttle_classes=[AnonRateThrottle]

   def get_object(self):
        try:
            obj = super().get_object()
            logger.info(f"Message {obj.id} retrieved successfully")
            return obj
        except Exception as e:
            logger.error(f"Error retrieving message: {str(e)}")
            raise e