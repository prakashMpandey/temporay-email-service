
from django.urls import path
from .views import get_all_messages,get_new_email
urlpatterns = [
    path('messages/',get_all_messages),
    path('new/',get_new_email)
]