from __future__ import unicode_literals

from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=300)
    short_description = models.CharField(
       max_length=500, blank=True)
    # long_description
    # repo_url
    # author
    # interested_users
    # active_users
    created = models.DateTimeField(
        'date created', auto_now_add=True)
