// frontend/src/ProductList.js

import React, { useState } from 'react';

function ProductList() {
  const [products] = useState([
    { id: 1, name: 'Товар 1', price: 100, description: 'Описание товара 1' },
    { id: 2, name: 'Товар 2', price: 200, description: 'Описание товара 2' },
    { id: 3, name: 'Товар 3', price: 150, description: 'Описание товара 3' }
  ]);

  // Функция добавления товара в корзину — делает POST-запрос к Django
  const addToCart = async (productId) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/add_to_cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'), // Django требует CSRF токен
        },
        body: JSON.stringify({ product_id: productId })
      });

      const data = await response.json();
      if (data.status === 'ok') {
        alert('Товар добавлен в корзину!');
      }
    } catch (error) {
      console.error('Ошибка добавления товара:', error);
    }
  };

  // Получаем CSRF токен из cookies (для POST-запросов к Django)
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <div className="container">
      <h2>Список товаров</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5>{product.name}</h5>
                <p>{product.description}</p>
                <p>Цена: {product.price}</p>
                <button className="btn btn-success" onClick={() => addToCart(product.id)}>
                  Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
