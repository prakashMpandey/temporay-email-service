import random
import string
import names
from dotenv import load_dotenv
import os
from .models import MailBox

load_dotenv()

def create_unique_email()->str:
  while True:
    random_word =''.join(random.choices(string.ascii_letters,k=random.randint(3,5)))
    email=names.get_first_name() + random_word + os.getenv('DOMAIN_NAME')
    is_email_exists=MailBox.objects.filter(email_id=email).first()
    if not is_email_exists:
      return email;

