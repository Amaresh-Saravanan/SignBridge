import { Router } from 'express'
import { translateToISL, getAvailableGlosses } from '../services/islTranslator.js'
import { validateTranslate } from '../middleware/validate.js'

const router = Router()

router.post('/translate', validateTranslate, (req, res) => {
  try {
    const { sentence, context } = req.validated

    const result = translateToISL(sentence)

    res.json({
      success: true,
      data: {
        ...result,
        context: context
      }
    })
  } catch (error) {
    res.status(500).json({
      error: 'Translation failed',
      message: error.message
    })
  }
})

router.get('/glosses', (req, res) => {
  const glosses = getAvailableGlosses()
  res.json({
    success: true,
    data: {
      glosses: glosses,
      count: glosses.length
    }
  })
})

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'signbridge-translate',
    timestamp: new Date().toISOString()
  })
})

export default router
