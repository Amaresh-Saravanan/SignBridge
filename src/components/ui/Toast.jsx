import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { useToastStore } from '../../stores/toastStore'
import { useEffect, useState } from 'react'

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
}

const iconColors = {
  success: 'text-success-shade',
  warning: 'text-warning-shade',
  error: 'text-error-shade',
}

const barColors = {
  success: 'bg-success-shade',
  warning: 'bg-warning-shade',
  error: 'bg-error-shade',
}

function ToastItem({ toast }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const Icon = icons[toast.type] || icons.success
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const start = Date.now()
    const duration = toast.duration || 4000
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining === 0) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [toast.duration])

  return (
    <motion.div
      layout
      initial={{ y: -40, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative overflow-hidden bg-surface border border-border rounded-default p-4 min-w-80 max-w-105 shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className={`mt-0.5 shrink-0 ${iconColors[toast.type]}`} />
        <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
        <button
          onClick={() => removeToast(toast.id)}
          className="shrink-0 text-text-disabled hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-border">
        <div
          className={`h-full transition-none ${barColors[toast.type] || 'bg-accent-mint-shade'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed top-20 right-4 z-9999 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
