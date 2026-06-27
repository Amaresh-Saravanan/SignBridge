import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import translateRouter from './routes/translate.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' }
})
app.use('/api/', limiter)

app.use(express.json({ limit: '1mb' }))

app.use('/api', translateRouter)

app.get('/', (req, res) => {
  res.json({
    name: 'SignBridge API',
    version: '1.0.0',
    endpoints: {
      translate: 'POST /api/translate',
      glosses: 'GET /api/glosses',
      health: 'GET /api/health'
    }
  })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`SignBridge API running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
