"""tweetme URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

from tweets import views as tweet_views
from accounts import views as account_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', tweet_views.tweet_list_view),
    path('login/', account_views.login_view),
    path('logout/', account_views.logout_view),
    path('register/', account_views.registration_view),
    path('<int:tweet_id>', tweet_views.tweet_detail_view),
    path('api/tweets/', include('tweets.api.urls'), name='tweets_api' ),
    path('profile/', include('profiles.urls'), name='profiles'),
    path('api/profile/', include('profiles.api.urls'), name='profiles_api'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
