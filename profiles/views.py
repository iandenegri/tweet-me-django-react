# Django
from django.shortcuts import redirect, render
from django.http import Http404

#Local
from .models import Profile
from .forms import ProfileForm
# Create your views here.

def profile_detail_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        raise Http404
    profile = qs.first()
    if request.user.is_authenticated:
        cur_user_is_follower = request.user in profile.followers.all()
    else:
        cur_user_is_follower = False
    context = {}
    context['username'] = username
    context['profile'] = profile
    context['is_following'] = cur_user_is_follower
    return render(
        request, 
        template_name="profiles/detail.html",
        context=context,
        status=200)


def profile_update_view(request, *args, **kwargs):
    print("wah")
    if not request.user.is_authenticated:
        return redirect('/login?next=profile/update')
    
    user = request.user
    my_profile = user.profile
    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    }
    form = ProfileForm(request.POST or None, instance=my_profile, initial=user_data)
    if form.is_valid():
        profile_obj = form.save(commit=False)
        first_name = form.cleaned_data.get('first_name')
        last_name = form.cleaned_data.get('last_name')
        email = form.cleaned_data.get('email')
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()
        profile_obj.save()
    context = {
        "form": form,
        "btn_label": "Save",
        "title": "Update Profile",
    }
    return render(request, "profiles/update.html", context)