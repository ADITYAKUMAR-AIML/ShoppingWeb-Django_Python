from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Main website routes
    path('', include('app.urls')),  
    # API routes are included via app.urls
]

# For media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
