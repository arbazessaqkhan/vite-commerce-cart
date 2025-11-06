import { useState, useEffect } from 'react';
import { fetchProducts, addToCart } from '../api';
import { notifyCartChanged } from '../utils/cartRefresh';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(new Set());

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingToCart(prev => new Set(prev).add(productId));
    try {
      await addToCart(productId, 1);
      notifyCartChanged(); // ✅ notify after success
    } catch (err) {
      console.error('Add error:', err);
      alert('❌ ' + (err.message || 'Failed to add item'));
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Vibe Commerce</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-3">{product.description || 'No description'}</p>
              <p className="text-xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={addingToCart.has(product._id)}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  addingToCart.has(product._id) ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {addingToCart.has(product._id) ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}