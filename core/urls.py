from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkViewSet, GoogleLoginView, FavoriteAPIView

router = DefaultRouter()
router.register(r'works', WorkViewSet, basename='works')

urlpatterns = [ 
  path('', include(router.urls)),
  path("auth/", include("dj_rest_auth.urls")),
  path("auth/registration/", include("dj_rest_auth.registration.urls")),
  path("auth/google/", GoogleLoginView.as_view(), name="google_login"),
  path("favorite/", FavoriteAPIView.as_view(), name='favorite-api'),
]
