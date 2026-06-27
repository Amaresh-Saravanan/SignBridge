import { z } from 'zod'

const translateSchema = z.object({
  sentence: z
    .string()
    .min(1, 'Sentence cannot be empty')
    .max(500, 'Sentence too long (max 500 characters)')
    .trim(),
  context: z
    .enum(['everyday', 'medical', 'education', 'legal'])
    .optional()
    .default('everyday')
})

export function validateTranslate(req, res, next) {
  const result = translateSchema.safeParse(req.body)

  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))

    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    })
  }

  req.validated = result.data
  next()
}

export function validateHealth(req, res, next) {
  next()
}
