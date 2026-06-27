import { motion } from 'framer-motion'

export default function WaveformMotif({ state = 'idle', className = '', size = 48 }) {
  // state can be 'listening', 'active', 'idle'

  const lineVariants = {
    listening: (i) => ({
      y: [0, i % 2 === 0 ? -6 : 6, 0],
      transition: {
        duration: 1.5 + i * 0.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }),
    idle: {
      y: 0,
      transition: { duration: 0.5 }
    },
    active: {
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  if (state === 'listening') {
    return (
      <div className={`flex items-center justify-center gap-1.5 h-8 ${className}`} style={{ width: size * 1.5 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={lineVariants}
            animate="listening"
            className="w-[2px] rounded-full bg-[var(--color-accent)]"
            style={{
              height: i === 2 ? '24px' : i === 1 || i === 3 ? '16px' : '10px',
              opacity: 0.3 + (i * 0.1)
            }}
          />
        ))}
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-accent)] opacity-85 transition-all duration-300"
        >
          {/* A simple hand outline */}
          <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v3.8" />
          <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
          <path d="M6 14v.5a6.5 6.5 0 0 0 13 0V10a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
          <path d="M18 16.5V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4" />
        </svg>
      </div>
    )
  }

  // Idle state: just a very subtle, flat calm wave line
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size * 1.5}
        height={12}
        viewBox="0 0 100 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-[var(--color-text-secondary)] opacity-30"
      >
        <motion.path
          d="M 0 6 Q 25 4, 50 6 T 100 6"
          animate={{
            d: [
              "M 0 6 Q 25 4, 50 6 T 100 6",
              "M 0 6 Q 25 8, 50 6 T 100 6",
              "M 0 6 Q 25 4, 50 6 T 100 6"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  )
}
