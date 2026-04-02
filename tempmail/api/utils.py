import random
import string
import names

def create_unique_email():
  random_word =''.join(random.choices(string.ascii_letters,k=random.randint(3,5)))
  name=names.get_first_name() + random_word + '@test.com'
  return name

