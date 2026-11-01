import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { tokenCookieName } from '../utils/auth.js'

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[tokenCookieName]
    if (!token) return res.status(401).json({ success: false, message: 'Please sign in to continue.' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub).select('name email profileImage')
    if (!user) return res.status(401).json({ success: false, message: 'Your session is no longer valid.' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Your session is invalid or has expired.' })
  }
}
