import React, { useEffect, useState } from 'react';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cart/", {
      credentials: "include", // чтобы сессия Django работала
    })
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.items);
        setTotal(data.total);
      });
  }, []);

  const removeItem = (id) => {
    // Можно реализовать удаление через POST-запрос
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Корзина</h1>
      {cartItems.length === 0 ? (
        <p>Ваша корзина пуста!</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h3>{item.name}</h3>
              <p>Цена: {item.price}</p>
              <p>Количество: {item.quantity}</p>
              <button onClick={() => removeItem(item.id)}>Удалить</button>
            </div>
          ))}
          <h3>Общая сумма: {total}</h3>
          <button onClick={() => alert('Оформление покупки...')}>Оформить покупку</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
