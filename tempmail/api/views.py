from django.shortcuts import render
from rest_framework.decorators import api_view
from .utils import create_unique_email
from rest_framework.response import Response
from rest_framework import status
from .models import MailBox,Message
from .serializers import MessageSerializer,MessageListSerializer
from django.utils import timezone
from rest_framework import generics
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

        print("email",email)

        if not email:
           return Response({'error':"email not found"},status=status.HTTP_400_BAD_REQUEST)
        
        mailBox=MailBox.objects.filter(email_id=email).first();
        
        if not mailBox :
           print(mailBox)
           return Response({'message':"no session exists"},status=status.HTTP_404_NOT_FOUND)
        

        if  mailBox.expires_at<=timezone.now():
           return Response({'message':"email expired"},status=status.HTTP_410_GONE)
      

        messages=mailBox.messages.all().order_by('-created_at');

        if not messages:
           return Response({'data':[]},status=status.HTTP_200_OK)
        
        serializer=MessageListSerializer(messages,many=True)


        return Response({'data':serializer.data},status=status.HTTP_200_OK)
       
class get_message(generics.RetrieveAPIView):
   queryset=Message.objects.all()
   serializer_class=MessageSerializer