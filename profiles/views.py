# Django
from django.shortcuts import render
from django.http import Http404

#Local
from .models import Profile
# Create your views here.

def profile_detail_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        raise Http404
    profile = qs.first()
    context = {}
    context['username'] = username
    context['profile'] = profile
    return render(
        request, 
        template_name="profiles/detail.html",
        context=context,
        status=200)
