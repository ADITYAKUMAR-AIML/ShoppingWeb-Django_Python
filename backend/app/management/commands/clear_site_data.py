from django.core.management.base import BaseCommand
from app.models import (
    Product, ProductImage, Category,
    Item, ItemImage, Specification,
    Cart, CartItem, Order, OrderItem
)

ALLOWED = {
    "fashion": "Fashion",
    "electronics": "Electronics",
    "food": "Food",
    "home": "Home",
    "gaming": "Gaming",
}

class Command(BaseCommand):
    help = "Clear products/items and enforce fixed categories"

    def handle(self, *args, **options):
        # Delete orders and carts first (FKs)
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        CartItem.objects.all().delete()
        Cart.objects.all().delete()

        # Delete product-related data
        ProductImage.objects.all().delete()
        Product.objects.all().delete()

        # Delete legacy items
        ItemImage.objects.all().delete()
        Specification.objects.all().delete()
        Item.objects.all().delete()

        # Remove non-allowed categories
        Category.objects.exclude(slug__in=list(ALLOWED.keys())).delete()
        # Ensure allowed categories exist with the correct names
        for slug, name in ALLOWED.items():
            Category.objects.update_or_create(slug=slug, defaults={"name": name})

        self.stdout.write(self.style.SUCCESS("Site data cleared and categories enforced."))