import express from 'express';
import Product from '../models/Product.js';
import CartItem from '../models/CartItem.js';

const router = express.Router();

const MOCK_USER_ID = 'guest-123';

router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: MOCK_USER_ID })
      .populate('productId', 'name price') 
      .lean(); 

    if (!cartItems.length) {
      return res.json({ items: [], total: 0 });
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    const formattedItems = cartItems.map(item => ({
      id: item._id.toString(),
      productId: item.productId._id.toString(),
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      subtotal: (item.productId.price * item.quantity).toFixed(2)
    }));

    res.json({
      items: formattedItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (err) {
    console.error('Cart GET error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/', async (req, res) => {
  const { productId, qty = 1 } = req.body;

  if (!productId || qty <= 0) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cartItem = await CartItem.findOne({ userId: MOCK_USER_ID, productId });

    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      cartItem = new CartItem({
        userId: MOCK_USER_ID,
        productId,
        quantity: qty
      });
      await cartItem.save();
    }

    res.status(201).json({ message: 'Item added to cart', cartItemId: cartItem._id });
  } catch (err) {
    console.error('Cart POST error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await CartItem.findOneAndDelete({
      _id: req.params.id,
      userId: MOCK_USER_ID
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Cart DELETE error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

router.post('/checkout', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: MOCK_USER_ID })
      .populate('productId', 'name price');

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

    const receipt = {
      success: true,
      orderId: `order_${Date.now()}`,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
      itemCount: cartItems.length,
      message: 'Mock payment processed successfully'
    };

    await CartItem.deleteMany({ userId: MOCK_USER_ID });

    res.json(receipt);
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

export default router;