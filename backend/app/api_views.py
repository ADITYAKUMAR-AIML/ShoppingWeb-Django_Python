from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer

from django.db.models import Q
from .models import Product, Category, Cart, CartItem, Order, OrderItem, Auth, ProductImage
from .serializers import (
    ProductSerializer, CategorySerializer, CartSerializer, 
    CartItemSerializer, OrderSerializer, RegisterSerializer,
    UserSerializer
)

User = get_user_model()

class RegisterView(CreateAPIView):
    queryset = Auth.objects.all()  # Use Auth instead of User
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(available=True)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Price range
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset.order_by('-created_at')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        allowed = {'fashion','electronics','food','home','gaming'}
        data = request.data.copy()
        slug = data.get('category_slug')
        if slug:
            if slug not in allowed:
                return Response({"error":"Invalid category"}, status=status.HTTP_400_BAD_REQUEST)
            category, _ = Category.objects.get_or_create(slug=slug, defaults={'name': slug.capitalize()})
            data['category'] = category.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        output = ProductSerializer(product, context={'request': request}).data
        return Response(output, status=status.HTTP_201_CREATED)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def list(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_object()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id, available=True)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_item(self, request):
        cart = self.get_object()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            if quantity <= 0:
                cart_item.delete()
                return Response({"message": "Item removed from cart"})
            else:
                cart_item.quantity = quantity
                cart_item.save()
                serializer = CartItemSerializer(cart_item)
                return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found in cart"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)

        insufficient = []
        for item in cart.items.select_related('product').all():
            if item.quantity > (item.product.stock or 0):
                insufficient.append({
                    'product_id': item.product.id,
                    'name': item.product.name,
                    'requested': item.quantity,
                    'available': item.product.stock or 0,
                })
        if insufficient:
            raise ValidationError({
                'stock': 'Insufficient stock for some items',
                'details': insufficient,
            })

        order = serializer.save(user=self.request.user, total_amount=cart.total())

        for cart_item in cart.items.select_related('product').all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )

            product = cart_item.product
            product.stock = max(0, (product.stock or 0) - cart_item.quantity)
            product.available = product.stock > 0
            product.save(update_fields=['stock', 'available', 'updated_at'])

        cart.items.all().delete()

class UserProfileViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        if request.method == 'GET':
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
