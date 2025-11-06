import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCart } from '../api';
import { subscribe } from '../utils/cartRefresh';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCartCount = async () => {
    try {
      const cart = await fetchCart();
      setCartCount(cart.items.length);
    } catch {
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartCount();
    const unsubscribe = subscribe(loadCartCount);
    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
            Vibe Commerce
          </Link>
          <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
            <span className="sr-only">View cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {!loading && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}