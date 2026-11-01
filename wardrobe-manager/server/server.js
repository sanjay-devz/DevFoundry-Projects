import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { connectDatabase } from './config/db.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import clothingRoutes from './routes/clothingRoutes.js'
import outfitRoutes from './routes/outfitRoutes.js'
import plannerRoutes from './routes/plannerRoutes.js'
import accessoryRoutes from './routes/accessoryRoutes.js'
import maintenanceRoutes from './routes/maintenanceRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { allowedOrigins, originGuard } from './middleware/originGuard.js'

const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins().includes(origin)), credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/api', originGuard)
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))
app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok', service: 'wardrobe-manager-api' } }))
app.use('/api/auth', authRoutes)
app.use('/api/clothing', clothingRoutes)
app.use('/api/outfits', outfitRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/accessories', accessoryRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use(notFound)
app.use(errorHandler)

const port = Number(process.env.PORT) || 5000
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be configured with at least 32 characters')
  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URLS) throw new Error('CLIENT_URLS must include the deployed frontend origin in production')
  connectDatabase().then(() => app.listen(port, () => console.info(`API listening on ${port}`))).catch((error) => {
    console.error('Unable to start API:', error.message)
    process.exit(1)
  })
}

export default app
