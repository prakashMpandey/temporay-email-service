from django.shortcuts import render
from rest_framework.decorators import api_view
from .utils import create_unique_email
from rest_framework.response import Response
from rest_framework import status
from .models import MailBox,Message
from .serializers import MessageSerializer
from django.utils import timezone


@api_view(['GET'])
def get_new_email(request):
  email_address=create_unique_email()
  if email_address is None:
     print('email nahi aa rha h bahu')
     return
  
  email= MailBox.objects.create(email_id=email_address)

  return Response({'email':email.email_id},status=status.HTTP_200_OK)


@api_view(['POST'])
def get_all_messages(request):
    if request.method=='POST':
        email=request.data.get('email')

        if not email:
           return Response({'error':"email not found"},status=status.HTTP_400_BAD_REQUEST)
        
        mailBox=MailBox.objects.filter(email_id=email).first();
        
        if not mailBox :
           return Response({'message':"no session exists"},status=status.HTTP_404_NOT_FOUND)
        

        if  mailBox.expires_at<=timezone.now():
           return Response({'message':"email expired"},status=status.HTTP_410_GONE)
      

        messages=mailBox.messages.all().order_by('-created_at');

        if not messages:
           return Response({'data':[]},status=status.HTTP_200_OK)
        
        serializer=MessageSerializer(messages,many=True)


        return Response({'data':serializer.data},status=status.HTTP_200_OK)
       
      #   return Response({'message':'something went wrong'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


### expire logic




###  cleanup logic

### create a cron job that will do database cleanup every hour
