from django.shortcuts import render

# Create your views here.

def profile_detail_view(request, *args, **kwargs):
    context = {}
    return render(request, "profiles/detail.html", context)
