import mongoose from 'mongoose'

const clothingItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, enum: ['Shirts', 'T-Shirts', 'Trousers', 'Jeans', 'Jackets', 'Shoes', 'Accessories', 'Traditional Wear', 'Other'] },
  subcategory: { type: String, trim: true, maxlength: 60, default: '' },
  color: { type: String, required: true, trim: true, maxlength: 40 },
  colorHex: { type: String, default: '#A8A59D', match: /^#[\da-fA-F]{6}$/ },
  season: { type: String, enum: ['Spring', 'Summer', 'Autumn', 'Winter', 'All season'], default: 'All season' },
  brand: { type: String, trim: true, maxlength: 60, default: '' },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  imageUrl: { type: String, default: '' },
  cloudinaryPublicId: { type: String, default: '' },
}, { timestamps: true })
clothingItemSchema.index({ user: 1, category: 1, color: 1, season: 1 })
clothingItemSchema.index({ user: 1, createdAt: -1 })
export default mongoose.model('ClothingItem', clothingItemSchema)
