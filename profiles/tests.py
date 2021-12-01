# Django
from django.test import TestCase
from django.contrib.auth import get_user_model

# Rest FrameWork 
from rest_framework.test import APIClient

# Local
from .models import Profile

User = get_user_model()
# Create your tests here.

class ProfileTestCase(TestCase):

    def setUp(self):
        self.user0 = User.objects.create_user(username="test_user0", password="SomePassWord0")
        self.user1 = User.objects.create_user(username="test_user1", password="SomePassWord0")
    
    def get_client(self):
        client = APIClient()
        client.login(username=self.user0.username, password='SomePassWord0')
        return client

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

    def test_follow_api_endpoint(self):
        """
        Test that following through API with command parameter works
        """
        user_b_profile = self.user1.profile
        user_b_followers_count = user_b_profile.followers.count()
        self.assertEqual(user_b_followers_count, 0)
        client = self.get_client()
        test_content = "follow"
        post_data = {"action": test_content}
        response = client.post(f"/api/profile/{self.user1.username}/follow/", post_data)
        self.assertEqual(response.status_code, 200)
        user_b_followers_count = user_b_profile.followers.count()
        self.assertEqual(user_b_followers_count, 1)

    def test_unfollow_api_endpoint(self):
        user_b_profile = self.user1.profile
        user_b_profile.followers.add(self.user0)
        user_b_followers_count = user_b_profile.followers.count()
        self.assertEqual(user_b_followers_count, 1)
        client = self.get_client()
        test_content = "unfollow"
        post_data = {"action": test_content}
        response = client.post(f"/api/profile/{self.user1.username}/follow/", post_data)
        self.assertEqual(response.status_code, 200)
        user_b_followers_count = user_b_profile.followers.count()
        self.assertEqual(user_b_followers_count, 0)

    def test_follow_self_api_endpoint(self):
        """
        Test that following through API with command parameter works
        """
        user_a_profile = self.user0.profile
        client = self.get_client()
        test_content = "follow"
        post_data = {"action": test_content}
        response = client.post(f"/api/profile/{self.user0.username}/follow/", post_data)
        self.assertEqual(response.status_code, 400)
        message = response.json()["message"]
        count = response.json()["count"]
        self.assertEqual(message, "You can't follow yourself...")
        self.assertEqual(count, 0)