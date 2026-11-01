import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.get('/stats', requireAuth, getDashboardStats)
export default router
