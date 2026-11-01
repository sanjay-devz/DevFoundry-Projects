import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { login, logout, me, register, updatePassword, updateProfile } from '../controllers/authController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' } })
router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)
router.put('/profile', requireAuth, updateProfile)
router.put('/password', requireAuth, updatePassword)

export default router
