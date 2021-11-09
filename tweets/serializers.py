from django.conf import settings

from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.fields import SerializerMethodField

from .models import Tweet

MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH
TWEET_ACTION_OPTIONS = settings.TWEET_ACTION_OPTIONS


class TweetActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)
    def validate_action(self, value):
        value = value.lower().strip()  # Clean up value for less false negatives
        if value not in TWEET_ACTION_OPTIONS:
            raise serializers.ValidationError("A valid action was not submitted")
        else:
            return value


class TweetCreateSerializer(serializers.ModelSerializer):
    likes = SerializerMethodField(read_only=True)
    class Meta:
        model = Tweet
        fields = ['id', 'content', 'likes']
    
    def get_likes(self, obj):
        return obj.likes.count()

    def validate_content(self, value):
        if len(value) > MAX_TWEET_LENGTH:
            raise serializers.ValidationError("This tweet is too long man, what the heck")
        else:
            return value

class TweetSerializer(serializers.ModelSerializer):
    likes = SerializerMethodField(read_only=True)
    parent = TweetCreateSerializer(read_only=True)
    class Meta:
        model = Tweet
        fields = ['id', 'content', 'likes', 'is_retweet', 'parent']
    
    def get_likes(self, obj):
        return obj.likes.count()
