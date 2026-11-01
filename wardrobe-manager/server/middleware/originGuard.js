const allowedOrigins = () => (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean)

export function originGuard(req, res, next) {
  const origin = req.get('origin')
  if (origin && !allowedOrigins().includes(origin)) return res.status(403).json({ success: false, message: 'This origin is not allowed to make changes.' })
  next()
}

export { allowedOrigins }
