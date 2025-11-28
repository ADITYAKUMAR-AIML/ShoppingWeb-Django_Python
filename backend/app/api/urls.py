from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from app.api_views import (
    ProductViewSet, CategoryViewSet, CartViewSet, OrderViewSet,
    UserProfileViewSet, RegisterView, get_current_user
)

router = routers.DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('categories', CategoryViewSet, basename='category')
router.register('cart', CartViewSet, basename='cart')
router.register('orders', OrderViewSet, basename='order')
router.register('profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/user/', get_current_user, name='auth-user'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]