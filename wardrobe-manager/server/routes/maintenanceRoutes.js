import { Router } from 'express'
import ClothingItem from '../models/ClothingItem.js'
import MaintenanceTask from '../models/MaintenanceTask.js'
import { crudController } from '../utils/crudController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const controller = crudController(MaintenanceTask, {
  fields: ['clothingItem', 'taskType', 'description', 'dueDate', 'status'], populate: 'clothingItem',
  query: (req) => ({ ...(req.query.status ? { status: req.query.status } : {}) }),
  prepare: async (values, user) => {
    if (values.clothingItem && !await ClothingItem.exists({ _id: values.clothingItem, user: user.id })) { const error = new Error('Choose an item from your wardrobe.'); error.status = 400; throw error }
    if (values.dueDate && Number.isNaN(new Date(values.dueDate).getTime())) { const error = new Error('Enter a valid due date.'); error.status = 400; throw error }
    return values
  },
})
router.use(requireAuth)
router.get('/', controller.list); router.post('/', controller.create); router.get('/:id', controller.get); router.put('/:id', controller.update); router.delete('/:id', controller.remove)
export default router
