from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app import api_views
from rest_framework_simplejwt.views import (


    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .api_views import (
    ProductViewSet, CategoryViewSet, CartViewSet, 
    OrderViewSet, RegisterView, UserProfileViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/user/', api_views.get_current_user, name='current_user'),
]