import mongoose from 'mongoose'

const maintenanceTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  clothingItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', required: true },
  taskType: { type: String, required: true, enum: ['Wash', 'Iron', 'Repair', 'Dry clean', 'Other'] },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
}, { timestamps: true })
maintenanceTaskSchema.index({ user: 1, status: 1, dueDate: 1 })
export default mongoose.model('MaintenanceTask', maintenanceTaskSchema)
