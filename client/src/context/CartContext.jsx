import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart } from '../api.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCartCount = async () => {
    try {
      const cart = await fetchCart();
      setCartCount(cart.items.length);
    } catch (err) {
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}