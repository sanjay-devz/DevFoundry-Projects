import mongoose from 'mongoose'

const accessorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  type: { type: String, required: true, enum: ['Watch', 'Belt', 'Bag', 'Sunglasses', 'Shoes', 'Jewelry', 'Other'] },
  color: { type: String, required: true, trim: true, maxlength: 40 },
  colorHex: { type: String, default: '#A8A59D', match: /^#[\da-fA-F]{6}$/ },
  brand: { type: String, trim: true, maxlength: 60, default: '' },
  imageUrl: { type: String, default: '' },
  description: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true })
accessorySchema.index({ user: 1, createdAt: -1 })
export default mongoose.model('Accessory', accessorySchema)
