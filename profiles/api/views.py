# Django
from django.contrib.auth import get_user_model

# DRF
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Local
from tweets.serializers import TweetSerializer, TweetActionSerializer, TweetCreateSerializer
from profiles.models import Profile
from profiles.serializers import PublicProfileSerializer

User = get_user_model()


@api_view(['POST'])  # Only allow POST as the type of requests this end point takes
@permission_classes([IsAuthenticated])
def user_follow_view(request, username, *args, **kwargs):
    current_user = request.user
    user_to_follow = User.objects.filter(username=username).first()
    if current_user.username == username:
        my_followers = User.objects.filter(username=username).first().profile.followers.all()
        return Response({"message": "You can't follow yourself...", "count": my_followers.count()}, status=400)
    if not user_to_follow:
        return Response({"message": "The user does not exist"}, status=404)
    user_to_follow_profile = user_to_follow.profile

    data = {}
    try:
        data = request.data
    except Exception as e:
        return Response({"message": e}, status=400)
    action = data["action"].lower() if data["action"] else ""
    if action == "follow":
        user_to_follow_profile.followers.add(current_user)
    elif action == "unfollow":
        user_to_follow_profile.followers.remove(current_user)
    else:
        return Response({"message": "Please pass a valid action. (follow or unfollow)"}, status=400)
    prof_obj = PublicProfileSerializer(instance=user_to_follow_profile, context={'request': request})
    return Response({"message":f"{current_user} has successfully {action}ed {user_to_follow}.", "data": prof_obj.data}, status=200)

@api_view(['GET'])
def profile_detail_api_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"message": f"A user with username: {username} does not exist"}, status=404)
    profile = qs.first()
    prof_obj = PublicProfileSerializer(instance=profile, context={'request': request})
    return Response(
        prof_obj.data,
        status=200)