from django.contrib import admin
from .models import * #Imported all models

admin.site.register(Auth) #Registered
admin.site.register(Item) #Registered
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ProductImage)

