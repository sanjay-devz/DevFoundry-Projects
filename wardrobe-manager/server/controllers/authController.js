import User from '../models/User.js'
import { createToken, tokenCookieName, tokenCookieOptions } from '../utils/auth.js'

const userView = (user) => ({ id: user.id, name: user.name, email: user.email, profileImage: user.profileImage })
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function register(req, res, next) {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''
    if (name.length < 2 || name.length > 60) return res.status(400).json({ success: false, message: 'Name must be 2 to 60 characters.' })
    if (!validEmail(email) || email.length > 254) return res.status(400).json({ success: false, message: 'Enter a valid email address.' })
    if (password.length < 8 || password.length > 72) return res.status(400).json({ success: false, message: 'Password must be 8 to 72 characters.' })
    if (await User.exists({ email })) return res.status(409).json({ success: false, message: 'An account with that email already exists.' })
    const user = await User.create({ name, email, password })
    res.cookie(tokenCookieName, createToken(user.id), tokenCookieOptions)
    res.status(201).json({ success: true, data: { user: userView(user) } })
  } catch (error) { next(error) }
}

export async function login(req, res, next) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''
    if (!validEmail(email) || !password) return res.status(400).json({ success: false, message: 'Enter your email and password.' })
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
    res.cookie(tokenCookieName, createToken(user.id), tokenCookieOptions)
    res.json({ success: true, data: { user: userView(user) } })
  } catch (error) { next(error) }
}

export function logout(req, res) {
  res.clearCookie(tokenCookieName, { ...tokenCookieOptions, maxAge: undefined })
  res.json({ success: true, data: { message: 'Signed out.' } })
}

export function me(req, res) {
  res.json({ success: true, data: { user: userView(req.user) } })
}

export async function updateProfile(req, res, next) {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
    if (name.length < 2 || name.length > 60) return res.status(400).json({ success: false, message: 'Name must be 2 to 60 characters.' })
    req.user.name = name
    await req.user.save()
    res.json({ success: true, data: { user: userView(req.user) } })
  } catch (error) { next(error) }
}

export async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body
    if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 72) return res.status(400).json({ success: false, message: 'New password must be 8 to 72 characters.' })
    const user = await User.findById(req.user.id).select('+password')
    if (!await user.comparePassword(String(currentPassword || ''))) return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
    user.password = newPassword
    await user.save()
    res.json({ success: true, data: { message: 'Password updated.' } })
  } catch (error) { next(error) }
}
