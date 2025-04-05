# store/views.py

from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Product, Order, OrderItem
from django.views.decorators.csrf import csrf_exempt
import json

# 🔹 Главная страница (MVC)
def index(request):
    # Простейшая сортировка и фильтрация
    sort = request.GET.get('sort', '')
    search = request.GET.get('search', '')
    products = Product.objects.all()
    if search:
        products = products.filter(name__icontains=search)
    if sort == 'price_asc':
        products = products.order_by('price')
    elif sort == 'price_desc':
        products = products.order_by('-price')
    return render(request, 'store/index.html', {'products': products})

# 🔹 Добавление в корзину (SPA)
@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            product_id = str(data.get('product_id'))
        except:
            return JsonResponse({'status': 'invalid JSON'}, status=400)

        cart = request.session.get('cart', {})

        if product_id in cart:
            cart[product_id] += 1
        else:
            cart[product_id] = 1

        request.session['cart'] = cart
        return JsonResponse({'status': 'ok', 'cart_count': sum(cart.values())})
    return JsonResponse({'status': 'error'}, status=400)

# 🔹 API для получения содержимого корзины (SPA)
def api_cart(request):
    cart = request.session.get('cart', {})
    result = []
    for prod_id, quantity in cart.items():
        try:
            product = Product.objects.get(id=prod_id)
            result.append({
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'price': float(product.price),
                },
                'quantity': quantity
            })
        except:
            pass
    return JsonResponse({'items': result})

# 🔹 Отображение корзины (MVC)
def cart_view(request):
    cart = request.session.get('cart', {})
    products_in_cart = []
    total = 0
    for prod_id, quantity in cart.items():
        try:
            product = Product.objects.get(id=prod_id)
            products_in_cart.append({
                'product': product,
                'quantity': quantity,
                'subtotal': product.price * quantity
            })
            total += product.price * quantity
        except Product.DoesNotExist:
            pass
    context = {
        'products_in_cart': products_in_cart,
        'total': total
    }
    return render(request, 'store/cart.html', context)

# 🔹 Оформление заказа
def checkout(request):
    if request.method == "POST":
        cart = request.session.get('cart', {})
        city = request.POST.get('city', 'Не указан')
        if not cart:
            return redirect('index')

        order = Order.objects.create(city=city)
        for prod_id, quantity in cart.items():
            try:
                product = Product.objects.get(id=prod_id)
                OrderItem.objects.create(order=order, product=product, quantity=quantity)
            except Product.DoesNotExist:
                continue
        request.session['cart'] = {}  # очищаем корзину
        return redirect('order_success')
    return redirect('cart')

# 🔹 Успешный заказ
def order_success(request):
    return render(request, 'store/order_success.html')
