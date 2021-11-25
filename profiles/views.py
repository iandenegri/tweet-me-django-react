from django.shortcuts import render

# Create your views here.

def profile_detail_view(request, username, *args, **kwargs):
    can_tweet = 'true' if request.user == username else 'false'
    context = {}
    context['username'] = username
    context['user_can_tweet'] = can_tweet
    return render(
        request, 
        template_name="profiles/detail.html",
        context=context,
        status=200)
