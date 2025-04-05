// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './ProductList';
import Cart from './Cart';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: '10px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Главная</Link>
          <Link to="/cart">Корзина</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
