from django.test import TestCase
from rest_framework.test import APIClient
from .models import MailBox,Message
from rest_framework import status
from django.urls import reverse


class TestMyModelSetup(TestCase):

    def setUp(self):
        self.client=APIClient()
        self.mailbox=MailBox.objects.create(email_id='test@pmpandey.me')
        self.message=Message.objects.create(
            receiver=self.mailbox,
            sender='sender@example.com',
            subject='Test Subject',
            body='Test message body'
        )
    
    def test_get_new_email(self):
        response=self.client.get(reverse('new-email'))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertIn('email',response.data)
        self.assertEqual(response['content-type'],'application/json')

        self.assertTrue(response.data['email'].endswith('@pmpandey.me'))

    def test_get_messages(self):
        new_email=self.client.get(reverse('new-email'))
        generated_email=new_email.data['email']


        url=reverse('all-messages')
        data={"email":generated_email}

        response=self.client.post(url,data,format='json')

        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response['content-type'],'application/json')
        self.assertIn('data',response.data)
        self.assertIsInstance(response.data['data'],list)
        'id','sender','subject',
    
        for msg in response.data['data']:
            self.assertIsInstance(self.message.id,msg.id)


    def test_get_message(self):
        message_id=self.message.id
        url=reverse('get-message',kwargs={'pk':message_id})
        response=self.client.get(url)

        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['id'],message_id)
        self.assertEqual(response.data['subject'],self.message.subject)
        self.assertEqual(response.data['body'],self.message.body)
        self.assertEqual(response.data['sender'],self.message.sender)
        
