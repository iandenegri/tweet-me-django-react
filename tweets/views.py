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
        template_name="standard/feed.html",
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
