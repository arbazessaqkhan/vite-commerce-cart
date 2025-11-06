import Product from './models/Product.js';

const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Wireless Headphones', price: 89.99, description: 'Noise-cancelling Bluetooth headphones' },
      { name: 'Smart Watch', price: 199.99, description: 'Fitness and health tracker' },
      { name: 'Laptop Stand', price: 34.50, description: 'Adjustable aluminum stand' },
      { name: 'USB-C Hub', price: 45.00, description: '6-in-1 adapter for laptops' },
      { name: 'Mechanical Keyboard', price: 129.99, description: 'RGB backlit gaming keyboard' },
      { name: 'Wireless Mouse', price: 29.99, description: 'Ergonomic silent-click mouse' },
      { name: 'Phone Charger', price: 19.99, description: 'Fast 20W USB-C charger' },
      { name: 'Webcam', price: 69.99, description: '1080p HD webcam with mic' }
    ]);
    console.log('✅ Products seeded');
  } else {
    console.log(`📦 ${count} products already exist`);
  }
};

export default seedProducts;