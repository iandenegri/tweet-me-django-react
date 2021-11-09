from django.urls import path

from .views import home, tweet_action_view, tweet_create_view, tweet_delete_view, tweet_detail, tweet_list

urlpatterns = [
    path('', tweet_list),
    path('action/', tweet_action_view),
    path('create/', tweet_create_view),
    path('<int:tweet_id>/', tweet_detail),
    path('<int:tweet_id>/delete/', tweet_delete_view),
]