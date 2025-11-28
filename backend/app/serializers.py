from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Product, Category, Cart, CartItem, Order, OrderItem, ProductImage

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    category_slug = serializers.CharField(write_only=True, required=False)
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 
            'category', 'category_slug', 'category_name', 'images', 'image',
            'available', 'stock', 'created_at', 'updated_at'
        ]

    def get_images(self, obj):
        request = self.context.get('request')
        def build_url(image_field):
            url = image_field.url if hasattr(image_field, 'url') else image_field
            if request and url and not url.startswith('http'):
                return request.build_absolute_uri(url)
            return url
        return [{'id': img.id, 'url': build_url(img.image)} for img in obj.images.all()]

    def get_image(self, obj):
        request = self.context.get('request')
        first = obj.images.first()
        if not first:
            return None
        url = first.image.url if hasattr(first.image, 'url') else first.image
        if request and url and not url.startswith('http'):
            return request.build_absolute_uri(url)
        return url

    def validate(self, attrs):
        category = attrs.get('category')
        category_slug = self.initial_data.get('category_slug')
        if not category and not category_slug:
            raise serializers.ValidationError({'category': 'Provide category or category_slug'})
        if 'price' in attrs and attrs['price'] is None:
            raise serializers.ValidationError({'price': 'Price is required'})
        if 'name' in attrs and not attrs['name']:
            raise serializers.ValidationError({'name': 'Name is required'})
        return attrs

    def create(self, validated_data):
        from .models import Category, ProductImage
        category_slug = validated_data.pop('category_slug', None)
        if category_slug and 'category' not in validated_data:
            try:
                validated_data['category'] = Category.objects.get(slug=category_slug)
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category_slug': 'Invalid category'})

        product = Product.objects.create(**validated_data)

        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            for file in request.FILES.getlist('images'):
                ProductImage.objects.create(product=product, image=file)

        return product

    def update(self, instance, validated_data):
        from .models import Category, ProductImage
        category_slug = validated_data.pop('category_slug', None)
        if category_slug:
            try:
                instance.category = Category.objects.get(slug=category_slug)
            except Category.DoesNotExist:
                raise serializers.ValidationError({'category_slug': 'Invalid category'})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            for file in request.FILES.getlist('images'):
                ProductImage.objects.create(product=instance, image=file)

        return instance

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.subtotal()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total', 'created_at', 'updated_at']

    def get_total(self, obj):
        return obj.total()

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'items', 'total_amount', 'status',
            'shipping_address', 'billing_address', 'payment_method',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'items', 'total_amount', 'created_at', 'updated_at']