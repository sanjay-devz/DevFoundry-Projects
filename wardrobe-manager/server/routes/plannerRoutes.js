import { Router } from 'express'
import Outfit from '../models/Outfit.js'
import OutfitPlan from '../models/OutfitPlan.js'
import { crudController } from '../utils/crudController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const controller = crudController(OutfitPlan, {
  fields: ['date', 'outfit', 'notes'], populate: { path: 'outfit', populate: { path: 'items' } },
  sort: () => ({ date: 1 }),
  query: (req) => {
    const filter = {}
    if (req.query.from || req.query.to) filter.date = { ...(req.query.from ? { $gte: new Date(req.query.from) } : {}), ...(req.query.to ? { $lt: new Date(req.query.to) } : {}) }
    return filter
  },
  prepare: async (values, user) => {
    if (values.outfit && !await Outfit.exists({ _id: values.outfit, user: user.id })) { const error = new Error('Choose an outfit from your saved wardrobe.'); error.status = 400; throw error }
    if (values.date && Number.isNaN(new Date(values.date).getTime())) { const error = new Error('Enter a valid date.'); error.status = 400; throw error }
    return values
  },
})
router.use(requireAuth)
router.get('/', controller.list); router.post('/', controller.create); router.get('/:id', controller.get); router.put('/:id', controller.update); router.delete('/:id', controller.remove)
export default router
