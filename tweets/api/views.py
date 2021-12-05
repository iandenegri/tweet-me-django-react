# Django

# DRF
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

# Local
from tweets.serializers import TweetSerializer, TweetActionSerializer, TweetCreateSerializer
from tweets.models import Tweet


def get_paginated_queryset_response(qs, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = TweetSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def tweet_list(request, *args, **kwargs):
    qs = Tweet.objects.all()
    username = request.GET.get('username')  # Pass parameter to BE from FE
    if username != None:
        qs = qs.filter(author__username=username)
    return get_paginated_queryset_response(qs, request)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tweet_feed_list(request, *args, **kwargs):
    qs = Tweet.objects.feed(request.user)
    return get_paginated_queryset_response(qs, request)

@api_view(['GET'])
def tweet_detail(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data)


@api_view(['POST'])  # Only allow POST as the type of requests this end point takes
@permission_classes([IsAuthenticated])
def tweet_create_view(request, *args, **kwargs):
    data = request.data or None
    serializer = TweetCreateSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)


@api_view(['DELETE', 'POST'])  # Only allow POST as the type of requests this end point takes
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(author=request.user)
    if not qs.exists():
        return Response({"message": "Unauthorized, you cannot delete this"}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({"message": "Tweet successfully deleted."}, status=200)


@api_view(['POST'])  # Only allow POST as the type of requests this end point takes
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *args, **kwargs):
    """
    id is required
    Action options are: Like, Unlike, Retweet, Unretweet (case insensitive)
    """
    serializer = TweetActionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        tweet_id = data.get("id")
        action = data.get("action")
        content = data.get("content") if data.get("content") else ""
        qs = Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        if action == 'unlike':
            obj.likes.remove(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == 'like':
            obj.likes.add(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == 'retweet':
            new_tweet = Tweet.objects.create(author=request.user,parent=obj,content=content)
            serializer = TweetSerializer(new_tweet)
            return Response(serializer.data, status=201)
        elif action == 'unretweet':
            # TODO retweet logic
            pass
    return Response({"message": "Unexpected error"}, status=400)
