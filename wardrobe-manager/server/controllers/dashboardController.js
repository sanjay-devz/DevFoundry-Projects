import ClothingItem from '../models/ClothingItem.js'
import Outfit from '../models/Outfit.js'
import Accessory from '../models/Accessory.js'
import OutfitPlan from '../models/OutfitPlan.js'
import MaintenanceTask from '../models/MaintenanceTask.js'

export async function getDashboardStats(req, res, next) {
  try {
    const user = req.user.id
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
    const end = new Date(start); end.setDate(start.getDate() + 7)
    const [clothingCount, outfitCount, accessoryCount, plannedCount, pendingCount, recent, categories, upcoming] = await Promise.all([
      ClothingItem.countDocuments({ user }), Outfit.countDocuments({ user }), Accessory.countDocuments({ user }),
      OutfitPlan.countDocuments({ user, date: { $gte: start, $lt: end } }),
      MaintenanceTask.countDocuments({ user, status: 'Pending' }),
      ClothingItem.find({ user }).sort({ createdAt: -1 }).limit(4).select('name category color colorHex imageUrl createdAt'),
      ClothingItem.aggregate([{ $match: { user: req.user._id } }, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      MaintenanceTask.find({ user, status: 'Pending', dueDate: { $lte: end } }).populate('clothingItem', 'name category imageUrl').sort({ dueDate: 1 }).limit(5),
    ])
    res.json({ success: true, data: { stats: { clothingCount, outfitCount, accessoryCount, plannedCount, pendingCount }, recent, categories, upcoming } })
  } catch (error) { next(error) }
}
