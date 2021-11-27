from django.urls import path

from .views import user_follow_view

"""
endpoint: /api/profile/
"""

urlpatterns = [
    # path('<str:username>/', user_detail_view),
    path('<str:username>/follow/', user_follow_view),
]