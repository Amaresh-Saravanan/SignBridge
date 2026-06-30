import { motion } from 'framer-motion'

export default function BlobBackground({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-bg-base ${className}`}>
      {/* Animated Glowing Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent opacity-20 blur-[120px] mix-blend-screen pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.1, 0.8, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-success opacity-[0.12] blur-[100px] mix-blend-screen pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, 60, -60, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[30%] left-[60%] w-[350px] h-[350px] rounded-full bg-[#7C8CFF] opacity-[0.12] blur-[90px] mix-blend-screen pointer-events-none"
      />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  )
}
