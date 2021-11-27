from django.test import TestCase
from django.contrib.auth import get_user_model

from .models import Profile

User = get_user_model()
# Create your tests here.

class ProfileTestCase(TestCase):

    def setUp(self):
        self.user0 = User.objects.create_user(username="test_user0", password="SomePassWord0")
        self.user1 = User.objects.create_user(username="test_user1", password="SomePassWord0")
    
    def test_profile_created_via_signal(self):
        qs = Profile.objects.all()
        self.assertEqual(qs.count(), 2)

    def test_following(self):
        user_a_profile = self.user0.profile
        user_b_profile = self.user1.profile
        user_a_profile.followers.add(self.user1)
        user_a_followers_count = user_a_profile.followers.count()
        user_b_followers_count = user_b_profile.followers.count()
        user_b_following_count = self.user1.following.filter(user=self.user0).count()
        self.assertEqual(user_b_following_count, 1)
        self.assertEqual(user_a_followers_count, 1)
        self.assertEqual(user_b_followers_count, 0)