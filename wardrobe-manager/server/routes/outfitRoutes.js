import { Router } from 'express'
import ClothingItem from '../models/ClothingItem.js'
import OutfitPlan from '../models/OutfitPlan.js'
import Outfit from '../models/Outfit.js'
import { crudController } from '../utils/crudController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const controller = crudController(Outfit, {
  fields: ['name', 'description', 'items', 'isFavorite'], populate: 'items',
  query: (req) => req.query.favorite === 'true' ? { isFavorite: true } : {},
  prepare: async (values, user) => {
    if (values.items !== undefined) {
      if (!Array.isArray(values.items) || values.items.length < 1 || values.items.length > 20) { const error = new Error('Choose between 1 and 20 wardrobe items.'); error.status = 400; throw error }
      const uniqueItems = [...new Set(values.items.map(String))]
      if (uniqueItems.length !== values.items.length) { const error = new Error('An item can only be added once.'); error.status = 400; throw error }
      const count = await ClothingItem.countDocuments({ user: user.id, _id: { $in: uniqueItems } })
      if (count !== uniqueItems.length) { const error = new Error('One or more selected items are unavailable.'); error.status = 400; throw error }
      values.items = uniqueItems
    }
    return values
  },
})
router.use(requireAuth)
router.get('/', controller.list); router.post('/', controller.create); router.get('/:id', controller.get); router.put('/:id', controller.update)
router.delete('/:id', async (req,res,next)=>{try{await OutfitPlan.deleteMany({user:req.user.id,outfit:req.params.id});await controller.remove(req,res,next)}catch(error){next(error)}})
export default router
