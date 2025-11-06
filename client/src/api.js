const API_BASE = '/api';

export const fetchProducts = () =>
  fetch(`${API_BASE}/products`).then(res => {
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  });

export const addToCart = (productId, qty) =>
  fetch(`${API_BASE}/v1/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  }).then(res => {
    if (!res.ok) {
      return res.text().then(text => {
        throw new Error(text || 'Add failed');
      });
    }
    return res.json();
  });

export const fetchCart = () =>
  fetch(`${API_BASE}/v1/cart`).then(res => {
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  });

export const removeFromCart = (cartItemId) =>
  fetch(`${API_BASE}/v1/cart/${cartItemId}`, {
    method: 'DELETE'
  }).then(res => {
    if (!res.ok) throw new Error('Failed to remove item');
    return res.json();
  });

export const checkout = () =>
  fetch(`${API_BASE}/v1/cart/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems: [] })
  }).then(res => {
    if (!res.ok) {
      return res.text().then(text => {
        throw new Error(text || 'Checkout failed');
      });
    }
    return res.json();
  });