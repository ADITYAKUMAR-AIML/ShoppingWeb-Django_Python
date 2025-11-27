from django.urls import path, include
from rest_framework import routers
from app import views

# If using Django REST Framework
router = routers.DefaultRouter()
# router.register('your-model', views.YourViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Add your API endpoints here
    # path('products/', views.ProductList.as_view(), name='product-list'),
]