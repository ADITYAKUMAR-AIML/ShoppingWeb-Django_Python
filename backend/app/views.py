from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import *
from django.contrib.auth import login, logout
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import messages
from django.db.models import Q 
from django.contrib.auth.decorators import login_required
from .data import popular_items, Cart_items
from django.core.paginator import Paginator
from .form import ItemForm
from decimal import Decimal, InvalidOperation

@login_required(login_url='login_page')
def home(request):
    context = {
        'items': Item.objects.all()    
    }
    return render(request, 'home.html', context)

def signup_page(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        if Auth.objects.filter(email=email).exists():
            messages.error(request, "Email already registered. Please login instead.")
            return redirect("login_page")

        user = Auth.objects.create(
            email=email,
            password=make_password(password)
        )

        login(request, user)
        messages.success(request, "Account created successfully!")
        return redirect("home")

    return render(request, "sign_up.html")

def login_page(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = Auth.objects.get(email=email)
            if check_password(password, user.password):
                login(request, user)
                return redirect("home")
            else:
                messages.error(request, "Incorrect password!")
        except Auth.DoesNotExist:
            messages.error(request, "Invalid Email or Password")

        return redirect("login_page")

    return render(request, "login.html")

def logout_view(request):  # Renamed to avoid conflict with django.contrib.auth.logout
    if request.method == "POST":
        logout(request)
        return redirect("login_page")
    return render(request, "Logout.html")

def Cart(request):
    context = {
        'Cart_items': Cart_items
    }
    return render(request, "cart.html", context)

def Deals(request):
    return render(request, "Deals.html")

def item_view(request, pk):  # Fixed function name to match URL pattern
    item = get_object_or_404(Item.objects.prefetch_related("images"), pk=pk)
    context = {
        'item': item,
        'images': item.images.all(),
    }
    return render(request, "item.html", context)

def Contact(request):
    return render(request, "Contacting.html")

def Shop(request):  # Fixed function name to match URL pattern
    q = request.GET.get('q', '').strip()
    qs = Item.objects.all().order_by('-id')

    if q:
        qs = qs.filter(
            Q(name__icontains=q) |
            Q(description__icontains=q)
        )

    context = {
        'items': qs,
    }
    return render(request, "products.html", context)

@login_required
def add_item(request):
    form_data = {
        'name': '',
        'description': '',
        'price': '',
        'quantity': '',
        'category': '',
    }

    keys = request.POST.getlist("spec_key[]")
    values = request.POST.getlist("spec_value[]")

    form = ItemForm()
    
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        description = request.POST.get("description", "")
        price = request.POST.get("price", "")
        quantity = request.POST.get("quantity", "")
        category = request.POST.get("category", "")

        form_data.update({
            'name': name,
            'description': description,
            'price': price,
            'quantity': quantity,
            'category': category
        })

        # Fixed the Item_Auth check
        if Item_Auth(name) is None:
            messages.error(request, "Item already exists!")
            form = ItemForm(initial=form_data)
            context = {
                'form': form,
                'form_data': form_data,
            }
            return render(request, "add_item.html", context)
        else:
            try:
                max_digits_before_decimal = 6
                price_value = Decimal(str(price))
                
                if price_value.as_tuple().exponent < -2:
                    messages.error(request, "Price cannot have more than 2 decimal places!")
                    form = ItemForm(initial=form_data)
                    context = {'form': form, 'form_data': form_data}
                    return render(request, "add_item.html", context)
                
                digits_before_decimal = len(price_value.as_tuple().digits) + price_value.as_tuple().exponent
                if digits_before_decimal > max_digits_before_decimal:
                    messages.error(request, f"Price cannot have more than {max_digits_before_decimal} digits before the decimal!")
                    form = ItemForm(initial=form_data)
                    context = {'form': form, 'form_data': form_data}
                    return render(request, "add_item.html", context)

                if price_value == price_value.to_integral_value():
                    price_value = price_value + Decimal("0.99")
                    
            except (InvalidOperation, ValueError):
                messages.error(request, "Please enter a valid price!")
                form = ItemForm(initial=form_data)
                context = {'form': form, 'form_data': form_data}
                return render(request, "add_item.html", context)
            
            new_item = Item.objects.create(
                name=name,
                description=description,
                price=price_value,
                quantity=quantity,
                category=category,
                user=request.user
            )

            # Save multiple images
            for img in request.FILES.getlist("images"):
                ItemImage.objects.create(item=new_item, image=img)
                
            for k, v in zip(keys, values):
                if k.strip() and v.strip():
                    Specification.objects.create(item=new_item, key=k.strip(), value=v.strip())
            
            messages.success(request, "Item added successfully!")
            return redirect("add_item")
    
    context = {
        'form': form,
        'form_data': form_data,
    }
    return render(request, "add_item.html", context)

def Item_Auth(name):
    try:
        Item.objects.get(name=name)
        return None  # Item exists
    except ObjectDoesNotExist:
        return name  # Item doesn't exist

def PrivacyPolicy(request):
    return render(request, "policydownload.html")    

def ContactPage(request):
    return render(request, "ContactPage.html") 

def category(request, category_name):
    items = Item.objects.filter(category=category_name)
    context = {
        "items": items,
        "category": category_name,
    }
    return render(request, "category.html", context)

@login_required
def edit_item(request, pk):
    item = get_object_or_404(Item, pk=pk)

    if item.user != request.user:
        messages.error(request, "You are not allowed to edit this item.")
        return redirect("home")

    form_data = {
        'name': item.name,
        'description': item.description,
        'price': item.price,
        'quantity': item.quantity,
        'category': item.category,
    }

    keys = request.POST.getlist("spec_key[]")
    values = request.POST.getlist("spec_value[]")

    form = ItemForm(instance=item)

    if request.method == "POST":
        form = ItemForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            edited_item = form.save(commit=False)
            edited_item.user = request.user
            try:
                price_value = Decimal(request.POST.get("price", edited_item.price))
                if price_value.as_tuple().exponent < -2:
                    messages.error(request, "Price cannot have more than 2 decimal places!")
                    return render(request, "edit_item.html", {"form": form, "form_data": form_data, "item": item})
                if price_value == price_value.to_integral_value():
                    price_value = price_value + Decimal("0.99")
                edited_item.price = price_value
            except (InvalidOperation, ValueError):
                messages.error(request, "Please enter a valid price!")
                return render(request, "edit_item.html", {"form": form, "form_data": form_data, "item": item})

            edited_item.save()

            # Handle new images
            for img in request.FILES.getlist("images"):
                ItemImage.objects.create(item=edited_item, image=img)

            # Update specifications
            Specification.objects.filter(item=edited_item).delete()
            for k, v in zip(keys, values):
                if k.strip() and v.strip():
                    Specification.objects.create(item=edited_item, key=k.strip(), value=v.strip())

            messages.success(request, "Item updated successfully!")
            return redirect("item", pk=edited_item.pk)
        else:
            messages.error(request, "Please fix the errors below.")
            form_data.update(request.POST)

    context = {
        "form": form,
        "form_data": form_data,
        "item": item,
    }
    return render(request, "edit_item.html", context)