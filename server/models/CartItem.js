import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
  userId: { type: String, required: true, default: 'guest-123' }, 
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
}, {
  timestamps: true
});

export default model('CartItem', cartItemSchema);