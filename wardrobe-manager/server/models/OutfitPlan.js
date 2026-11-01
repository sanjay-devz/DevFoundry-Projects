import mongoose from 'mongoose'

const outfitPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  outfit: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit', required: true },
  notes: { type: String, trim: true, maxlength: 300, default: '' },
}, { timestamps: true })
outfitPlanSchema.index({ user: 1, date: 1 })
export default mongoose.model('OutfitPlan', outfitPlanSchema)
