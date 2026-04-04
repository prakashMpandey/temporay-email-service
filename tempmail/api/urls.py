
from django.urls import path
from .views import get_all_messages,get_new_email,get_message
urlpatterns = [
    path('messages/',get_all_messages,name='all-messages'),
    path('new/',get_new_email,name='new-email'),
    path('messages/<int:pk>',get_message.as_view(),name='get-message')
]