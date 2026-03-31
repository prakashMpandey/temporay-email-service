from django.contrib import admin
from .models import Message,MailBox
# Register your models here.

admin.site.register(Message)
admin.site.register(MailBox)