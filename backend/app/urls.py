# FashionCompras/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from app import views  # your existing views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Your existing URLs (keep these for non-API pages)
    path('', views.home, name='home'),
    path('signup/', views.signup_page, name='signup_page'),
    path('login/', views.login_page, name='login_page'),
    path('logout/', views.logout_view, name='logout'),
    path('Cart-items/', views.Cart, name='cart'),
    path('deals/', views.Deals, name='deals'),
    path('item/<int:pk>/', views.item_view, name='item'),
    path('add/', views.add_item, name='add_item'),
    path('Contact/', views.Contact, name='Contact'),
    path('PrivacyPolicy/', views.PrivacyPolicy, name='PrivacyPolicy'),
    path('Shop/', views.Shop, name='Shop'),
    path('category/<str:category_name>/', views.category, name='category'),
    path('item/<int:pk>/edit/', views.edit_item, name='edit_item'),
    path('ContactPage/', views.ContactPage, name='ContactPage'),
    
    # API URLs
    path('api/', include('app.api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)