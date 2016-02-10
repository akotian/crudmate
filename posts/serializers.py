from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    # TODO: This is temp filler field until I have user model
    profile_image = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ('id', 'title', 'description', 'repo_url',
                  'created', 'profile_image')

    def get_profile_image(self, obj):
        return '/static/images/heMan.jpeg'
