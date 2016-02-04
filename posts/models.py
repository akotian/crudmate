from __future__ import unicode_literals

from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(
       blank=True)
    repo_url = models.URLField(blank=True)
    # author
    # interested_users
    # active_users
    created = models.DateTimeField(
        'date created', auto_now_add=True)
