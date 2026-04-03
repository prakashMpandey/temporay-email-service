from rest_framework import serializers
from .models import Message


class MessageListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=['id','sender','subject','created_at']
        read_only_fields=('id','sender','subject','created_at')

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
     
        model=Message
        fields=['id','sender','body','subject','created_at']
        read_only_fields=('id','sender','subject','body','created_at')