import mongoose from 'mongoose'

const outfitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }],
  isFavorite: { type: Boolean, default: false },
}, { timestamps: true })
outfitSchema.index({ user: 1, updatedAt: -1 })
export default mongoose.model('Outfit', outfitSchema)
