from django.db import models
from django.conf import settings
from django.db.models.signals import post_save

User = settings.AUTH_USER_MODEL


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=220, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)

# TODO: Write AT LEAST one unit test
def user_saved(sender, instance, created, *args, **kwargs):
    # Create a Profile object when creating a user object
    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_saved, sender=User)