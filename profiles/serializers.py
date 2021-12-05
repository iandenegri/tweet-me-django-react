# DRF
from rest_framework import serializers

# Local
from .models import Profile


class PublicProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    follower_count = serializers.SerializerMethodField(read_only=True)
    following_count = serializers.SerializerMethodField(read_only=True)
    is_following = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'first_name',
            'last_name',
            'location',
            'bio',
            'follower_count',
            'following_count',
            'username',
            'id',
            'is_following'
        ]

    def get_first_name(self, obj):
        return obj.user.first_name
    
    def get_last_name(self, obj):
        return obj.user.last_name

    def get_username(self, obj):
        return obj.user.username
    
    def get_follower_count(self, obj):
        return obj.followers.count()
    
    def get_following_count(self, obj):
        return obj.user.following.count()

    def get_is_following(self, obj):
        req_user_is_following = False
        req = self.context.get("request")
        if req:
            req_user = req.user
            req_user_is_following = req_user in obj.followers.all()
        return req_user_is_following
    