import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const DOTS = [
  { color: 'var(--color-accent-mint-tint)', x: -28, y: -20, delay: 0 },
  { color: 'var(--color-accent-lavender-tint)', x: 28, y: -16, delay: 0.05 },
  { color: 'var(--color-accent-peach-tint)', x: -20, y: 24, delay: 0.1 },
  { color: 'var(--color-accent-mint-shade)', x: 24, y: 22, delay: 0.08 },
  { color: 'var(--color-accent-lavender-shade)', x: 0, y: -32, delay: 0.12 },
]

export default function PermissionGranted() {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {DOTS.map((dot, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
          animate={{ scale: [0, 1.5, 2.5], opacity: [1, 0.6, 0], x: dot.x, y: dot.y }}
          transition={{ duration: 0.6, delay: dot.delay, ease: 'easeOut' }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: dot.color }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-16 h-16 rounded-full bg-[var(--color-success-tint)] border border-[var(--color-success-shade)] flex items-center justify-center text-[var(--color-success-shade)]"
      >
        <CheckCircle2 size={32} />
      </motion.div>
    </div>
  )
}
