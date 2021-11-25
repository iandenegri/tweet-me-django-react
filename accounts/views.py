from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm


# Create your views here.
def login_view(request, *args, **kwargs):
    form = AuthenticationForm(request, data=request.POST or None)
    context = {
        "form": form,
        "title": "Login to TweetMe",
        "btn_label": "Login"
        }
    if form.is_valid():
        logging_in_user = form.get_user()
        login(request, logging_in_user)
        return redirect("/")
    return render(request, "accounts/auth.html", context)


def logout_view(request, *args, **kwargs):
    if request.method == "POST":
        logout(request)
        return redirect("/login")
    context = {
        "form": None,
        "title": "Log Out of TweetMe?",
        "description": "Are you sure you want to log out?",
        "btn_label": "Logout"
    }
    return render(request, "accounts/auth.html", context)

def registration_view(request, *args, **kwargs):
    form = UserCreationForm(request.POST or None)
    context = {
        "form": form,
        "title": "Register for TweetMe",
        "btn_label": "Register"
        }
    if form.is_valid():
        print(form.cleaned_data) # DELETE THIS THIS IS A PRIVACY FLAW
        user = form.save(commit=True)
        user.set_password(form.cleaned_data.get("password1"))
        login(request, user)
        return redirect("/login")
    return render(request, "accounts/auth.html", context)
