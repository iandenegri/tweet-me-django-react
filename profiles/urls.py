from django.urls import path, include

from .views import profile_detail_view, profile_update_view

app_name  = "profiles"
urlpatterns = [
    path('update/', profile_update_view, name="update"),
    path('<str:username>', profile_detail_view),
]
