import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCart, removeFromCart } from '../api';
import { notifyCartChanged } from '../utils/cartRefresh';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart()
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      notifyCartChanged();
      const updated = await fetchCart();
      setCart(updated);
    } catch (err) {
      alert('❌ Failed to remove item');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading cart...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
            Continue Shopping →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">${item.subtotal}</p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">${cart.total.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/checkout"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}