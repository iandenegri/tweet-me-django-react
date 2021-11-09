# Django
from django.contrib.auth import get_user_model
from django.test import TestCase

# Rest FrameWork 
from rest_framework.test import APIClient

# Local
from .models import Tweet, TweetLike

User = get_user_model()
# Create your tests here.
class TweetTestCase(TestCase):
    def setUp(self):
        self.user0 = User.objects.create_user(username="test_user0", password="SomePassWord0")
        self.user1 = User.objects.create_user(username="test_user1", password="SomePassWord0")
        # This can be done with a factory right..?
        Tweet.objects.create(author=self.user0, content="First Tweet")
        tweet2 = Tweet.objects.create(author=self.user0, content="Second Tweet")
        tweet2.likes.add(self.user0)
        Tweet.objects.create(author=self.user1, content="Third Tweet")
        self.initialNumOfTweets = Tweet.objects.all().count()

    def get_client(self):
        client = APIClient()
        client.login(username=self.user0.username, password='SomePassWord0')
        return client

    def test_tweet_created(self):
        test_content = "Forth Tweet"
        tweet = Tweet.objects.create(author=self.user0, content=test_content)
        self.assertEqual(tweet.content, test_content)
        self.assertEqual(tweet.author, self.user0)
        self.assertEqual(tweet.id, 4)

    def test_tweet_list(self):
        client = self.get_client()
        response = client.get("/api/tweets/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 3)
        Tweet.objects.create(author=self.user0, content="Fourth Tweet")
        response = client.get("/api/tweets/")
        self.assertEqual(len(response.json()), 4)
        self.assertEqual(response.json()[0]['content'], "Fourth Tweet")
    
    def test_tweet_action_like(self):
        client = self.get_client()
        post_data = {
            "id": 1,
            "action": "like"
            }
        response = client.post("/api/tweets/action/", post_data)
        tweet = Tweet.objects.get(id=1)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("likes"), 1)
        self.assertEqual(tweet.likes.count(), 1)

    def test_tweet_action_unlike(self):
        client = self.get_client()
        tweet = Tweet.objects.get(id=2)
        self.assertEqual(tweet.likes.count(), 1) # Before unliking
        post_data = {
            "id": 2,
            "action": "unlike"
            }
        response = client.post("/api/tweets/action/", post_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("likes"), 0) # After unliking
        self.assertEqual(tweet.likes.count(), 0)

    def test_tweet_action_retweet(self):
        client = self.get_client()
        parent_tweet = Tweet.objects.get(id=3)
        self.assertEqual(parent_tweet.parent, None) # Before retweeting
        post_data = {
            "id": 3,
            "action": "retweet"
            }
        response = client.post("/api/tweets/action/", post_data)
        retweet = Tweet.objects.get(id=int(response.json().get("id")))
        self.assertEqual(response.status_code, 201)  # Create a tweet, create = 201
        self.assertNotEqual(response.json().get("id"), 3) # After retweeting
        self.assertEqual(retweet.parent.id, 3) # Tweet has a parent w/ id equal to id in post data
        self.assertNotEqual(Tweet.objects.all().count(), self.initialNumOfTweets)

    def test_tweet_create(self):
        client = self.get_client()
        test_content = "Fourth tweet"
        post_data = {"content": test_content}
        response = client.post("/api/tweets/create/", post_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Tweet.objects.all().count(), self.initialNumOfTweets + 1)
        self.assertEqual(response.json().get("id"), 4)
        self.assertEqual(response.json().get("content"), test_content)

    def test_tweet_detail(self):
        client = self.get_client()
        test_id = 1
        response = client.get(f"/api/tweets/{test_id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("id"), test_id)

    def test_tweet_delete(self):
        client = self.get_client()
        test_id = 1
        response = client.delete(f"/api/tweets/{test_id}/delete/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Tweet.objects.all().count(), self.initialNumOfTweets - 1)

        response = client.delete(f"/api/tweets/{test_id}/delete/")
        self.assertEqual(response.status_code, 404)  # Tweet already deleted
        self.assertEqual(Tweet.objects.all().count(), self.initialNumOfTweets - 1)

        test_id_401 = 3
        response = client.delete(f"/api/tweets/{test_id_401}/delete/")
        self.assertEqual(response.status_code, 401)  # Not my own tweet
        self.assertEqual(Tweet.objects.all().count(), self.initialNumOfTweets - 1)