# store/models.py

from django.db import models

# Модель товара
class Product(models.Model):
    name = models.CharField(max_length=200)  # Название товара
    price = models.DecimalField(max_digits=8, decimal_places=2)    # Цена товара
    description = models.TextField(blank=True)  # Описание товара
    image = models.ImageField(upload_to='products/', blank=True, null=True)   # Изображение товара

    def __str__(self):
            return self.name


# Модель заказа
class Order(models.Model):
    city = models.CharField(max_length=100)  # Город, выбранный пользователем
    created_at = models.DateTimeField(auto_now_add=True)  # Время оформления заказа

    def __str__(self):
         return f"Order {self.id} from {self.city}"


# Модель элемента заказа (товар в заказе)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
         return f"{self.quantity} x {self.product.name}"
