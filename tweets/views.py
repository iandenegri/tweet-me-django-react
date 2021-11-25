# Django
from django.shortcuts import render

# DRF

# Local
from .models import Tweet


# Create your views here.

def home(request, *args, **kwargs):
    context = {}
    context['tweets'] = Tweet.objects.all()
    return render(
        request, 
        template_name="standard/home.html",
        context=context,
        status=200)

def tweet_list_view(request, *args, **kwargs):
    context = {}
    return render(
        request, 
        template_name="tweets/list.html",
        context=context,
        status=200)

def tweet_detail_view(request, tweet_id, *args, **kwargs):
    context = {}
    context['tweet_id'] =tweet_id
    return render(
        request, 
        template_name="tweets/detail.html",
        context=context,
        status=200)

def tweet_profile_view(request, username, *args, **kwargs):
    can_tweet = 'true' if request.user == username else 'false'
    context = {}
    context['username'] = username
    context['user_can_tweet'] = can_tweet
    return render(
        request, 
        template_name="tweets/profile.html",
        context=context,
        status=200)
