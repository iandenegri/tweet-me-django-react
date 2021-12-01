from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User


class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class TweetQuerySet(models.QuerySet):
    def feed(self, user):
        # This must return a queryset since it's in the Queryset class of the model
        my_user = user
        following_users = my_user.following.exists()
        followed_user_ids = []
        if following_users:
            followed_user_ids = my_user.following.values_list("user__id", flat=True) # [x.user.id for x in profiles]
        return self.filter(
            Q(author__id__in=followed_user_ids) | Q(author=my_user)
        ).distinct().order_by("-timestamp")


class TweetManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return TweetQuerySet(self.model, using=self._db)

    def feed(self, user):
        return self.get_queryset().feed(user)


class Tweet(models.Model):
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tweets")
    likes = models.ManyToManyField(User, related_name='tweet_user', blank=True, through=TweetLike)
    parent = models.ForeignKey("self", blank=True, null=True, on_delete=models.SET_NULL)
    timestamp = models.DateTimeField(auto_now_add=True)

    objects = TweetManager()

    class Meta:
        ordering = ['-id']

    @property
    def is_retweet(self):
        return self.parent != None
