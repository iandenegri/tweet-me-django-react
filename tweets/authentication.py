from django.contrib.auth import get_user_model
from rest_framework import authentication

User = get_user_model()


# Use this authentication so that we can access the BE while developing in react
class DevelopmentAuthentication(authentication.BasicAuthentication):
    def authenticate(self, request):
        qs = User.objects.all()
        user = qs.order_by("?").first()
        return (user, None)
