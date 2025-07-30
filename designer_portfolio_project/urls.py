from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

def health(request):
    return HttpResponse("ok", status=200)

urlpatterns = [
    path('api/', include('core.urls')),
    path('admin/', admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("health/", health, name="health"),
]

# 開発環境のみメディアファイルのURLルーティングを追加
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
