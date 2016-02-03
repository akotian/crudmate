from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
# from django.contrib import admin

from rest_framework.routers import DefaultRouter

from . import views
from posts.views import PostViewSet

urlpatterns = [
    # url(r'^admin/', admin.site.urls),
    url(r'^$', views.index, name='index'),
] + \
static(settings.STATIC_URL,
       document_root=settings.STATIC_ROOT)

router = DefaultRouter()
router.register(r'api/posts', PostViewSet)

urlpatterns += router.urls
