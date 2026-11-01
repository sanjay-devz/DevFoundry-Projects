import { Router } from 'express'
import multer from 'multer'
import { fileTypeFromBuffer } from 'file-type'
import ClothingItem from '../models/ClothingItem.js'
import Outfit from '../models/Outfit.js'
import MaintenanceTask from '../models/MaintenanceTask.js'
import { deleteImage, uploadImage } from '../config/cloudinary.js'
import { crudController } from '../utils/crudController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const fields = ['name', 'category', 'subcategory', 'color', 'colorHex', 'season', 'brand', 'description', 'imageUrl', 'cloudinaryPublicId']
const controller = crudController(ClothingItem, {
  fields,
  prepare: async (values, user) => {
    if (values.cloudinaryPublicId && !values.cloudinaryPublicId.startsWith(`wardrobe-manager/${user.id}/`)) { const error = new Error('That image does not belong to your account.'); error.status = 400; throw error }
    return values
  },
  query: (req) => {
    const filter = {}
    for (const key of ['category', 'color', 'season']) if (req.query[key]) filter[key] = key === 'color' ? new RegExp(`^${String(req.query[key]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') : req.query[key]
    if (req.query.q) filter.name = { $regex: String(req.query.q).slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
    return filter
  },
  sort: (req) => ({ ...(req.query.sort === 'name' ? { name: 1 } : req.query.sort === 'category' ? { category: 1, name: 1 } : req.query.sort === 'color' ? { color: 1, name: 1 } : { createdAt: -1 }) }),
  beforeDelete: async (item, user) => {
    await Promise.all([
      deleteImage(item.cloudinaryPublicId, user.id),
      Outfit.updateMany({ user: user.id }, { $pull: { items: item._id } }),
      MaintenanceTask.deleteMany({ user: user.id, clothingItem: item._id }),
    ])
  },
  afterUpdate: async (previous, item) => {
    if (previous?.cloudinaryPublicId && previous.cloudinaryPublicId !== item.cloudinaryPublicId) await deleteImage(previous.cloudinaryPublicId, item.user)
  },
})
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)) })
router.use(requireAuth)
router.get('/', controller.list)
router.post('/', controller.create)
router.post('/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Choose a JPG, PNG, WebP, or AVIF image under 5 MB.' })
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return res.status(503).json({ success: false, message: 'Image uploads are not configured yet.' })
    const detected = await fileTypeFromBuffer(req.file.buffer)
    if (!detected || !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(detected.mime)) return res.status(400).json({ success: false, message: 'The selected file is not a supported image.' })
    const result = await uploadImage(req.file.buffer, req.user.id)
    res.status(201).json({ success: true, data: { imageUrl: result.secure_url, cloudinaryPublicId: result.public_id } })
  } catch (error) { next(error) }
})
router.get('/:id', controller.get)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)
export default router
