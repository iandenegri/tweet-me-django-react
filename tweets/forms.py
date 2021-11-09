# Django
from django import forms
from django.conf import settings

# local
from .models import Tweet

MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH


class TweetCreateForm(forms.ModelForm):
    class Meta:
        model = Tweet
        fields = ['content']

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if len(content) > MAX_TWEET_LENGTH:
            raise forms.ValidationError("This tweet is too long man, what the heck")
        else:
            return content