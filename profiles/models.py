from django.db import models
from django.conf import settings
from django.db.models.signals import post_save

User = settings.AUTH_USER_MODEL


# Create your models here.
class FollowerRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=220, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    followers = models.ManyToManyField(User, related_name="following", blank=True)

# TODO: Write AT LEAST one unit test
def user_saved(sender, instance, created, *args, **kwargs):
    # Create a Profile object when creating a user object
    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_saved, sender=User)