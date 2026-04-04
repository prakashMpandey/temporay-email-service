from django.db import models
from django.utils import timezone
from datetime import timedelta
# Create your models here.


class MailBox(models.Model):
    email_id=models.EmailField(unique=True)
    created_at=models.DateTimeField(auto_now_add=True)
    expires_at=models.DateTimeField(db_index=True)

    def save(self, *args,**kwargs):
        if not self.expires_at:
            self.expires_at=timezone.now() + timedelta(minutes=10)

        return super().save(*args,**kwargs)


class Message(models.Model):
    receiver=models.ForeignKey(MailBox,on_delete=models.CASCADE,related_name='messages')
    sender=models.CharField(max_length=100)
    subject=models.CharField(max_length=200)
    body=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

