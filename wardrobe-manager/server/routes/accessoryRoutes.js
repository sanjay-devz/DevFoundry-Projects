import { Router } from 'express'
import Accessory from '../models/Accessory.js'
import { crudController } from '../utils/crudController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const controller = crudController(Accessory, { fields: ['name', 'type', 'color', 'colorHex', 'brand', 'imageUrl', 'description'], query: (req) => {
  const filter = {}
  if (req.query.type) filter.type = req.query.type
  if (req.query.q) filter.name = { $regex: String(req.query.q).slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
  return filter
} })
router.use(requireAuth)
router.get('/', controller.list); router.post('/', controller.create); router.get('/:id', controller.get); router.put('/:id', controller.update); router.delete('/:id', controller.remove)
export default router
