import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Cpu, Activity, Database, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react'

import PageWrapper from '../../components/layout/PageWrapper'
import AdminMobileNotice from '../../components/admin/AdminMobileNotice'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useToastStore } from '../../stores/toastStore'
import { mockMetrics } from '../../data/mockData'

export default function Dashboard() {
  const navigate = useNavigate()
  const addToast = useToastStore((s) => s.addToast)

  // System states
  const [isConnected, setIsConnected] = useState(true)
  const [latency, setLatency] = useState(mockMetrics.latency.current)
  const [yoloFps, setYoloFps] = useState(mockMetrics.yoloFps.current)
  const [translationsCount, setTranslationsCount] = useState(1247)
  const [epoch, setEpoch] = useState(mockMetrics.retraining.epoch)
  const [trainingProgress, setTrainingProgress] = useState(mockMetrics.retraining.progress)

  // Sparkline data
  const [latencyData, setLatencyData] = useState(mockMetrics.latency.data)
  const [fpsData, setFpsData] = useState(mockMetrics.yoloFps.data)
  const [translationsData, setTranslationsData] = useState(mockMetrics.translations.data)

  // 5s simulated polling loop
  useEffect(() => {
    let timer
    if (isConnected) {
      timer = setInterval(() => {
        // Vary latency slightly (±8ms)
        const latVal = Math.floor(135 + Math.random() * 20)
        setLatency(`${latVal}ms`)
        setLatencyData((d) => [...d.slice(1), latVal])

        // Vary FPS slightly (±2)
        const fpsVal = Math.floor(26 + Math.random() * 5)
        setYoloFps(`${fpsVal}`)
        setFpsData((d) => [...d.slice(1), fpsVal])

        // Increment total translations count (+1 to +3)
        const addCount = Math.floor(1 + Math.random() * 3)
        setTranslationsCount((c) => c + addCount)
        setTranslationsData((d) => [...d.slice(1), d[d.length - 1] + addCount])

        // Retraining progress step simulation
        setTrainingProgress((p) => {
          if (p >= 100) {
            setEpoch(1)
            return 10
          }
          const nextProgress = p + 2
          if (nextProgress % 10 === 0) {
            setEpoch((e) => Math.min(10, e + 1))
          }
          return nextProgress
        })
      }, 5000)
    }
    return () => clearInterval(timer)
  }, [isConnected])

  // Connection Toggler
  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false)
      addToast({ type: 'warning', message: 'System disconnected from live training pipeline.' })
    } else {
      setIsConnected(true)
      addToast({ type: 'success', message: 'System reconnected successfully!' })
    }
  }

  // Draw SVG Sparkline helper
  const drawSparkline = (data, min, max, width = 220, height = 50) => {
    if (data.length === 0) return ''
    const step = width / (data.length - 1)
    const points = data.map((val, idx) => {
      const x = idx * step
      // Invert Y coordinate for SVG space
      const y = height - ((val - min) / (max - min)) * (height - 8) - 4
      return `${x},${y}`
    })
    return points.join(' ')
  }

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg py-12 px-6 md:px-12">
      <AdminMobileNotice />
      {/* Offline Disconnected Banner */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-[rgba(248,113,113,0.1)] border border-[var(--color-error)] text-[var(--color-error)] rounded-[var(--radius-default)] p-4 mb-6 text-sm flex items-center justify-between max-w-[1280px] mx-auto z-20"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="animate-pulse" />
              <span>
                <strong>System Offline:</strong> Retraining server connection lost. Displaying cached dashboard data.
              </span>
            </div>
            <button
              onClick={toggleConnection}
              className="text-xs font-semibold underline hover:text-white transition-colors cursor-pointer"
            >
              Reconnect Node
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-8 relative">
        
        {/* Navigation back button */}
        <button
          onClick={() => navigate('/hub')}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer outline-none group"
          aria-label="Go back to Hub"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Hub
        </button>

        {/* Dashboard Header */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="h1 font-display tracking-tight">Developer Dashboard</h1>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Real-time telemetry and object detection metrics</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-text-disabled)]'}`} />
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {isConnected ? 'Connection Stable' : 'Node Disconnected'}
              </span>
            </div>
            <Button
              variant="secondary"
              onClick={toggleConnection}
              className="!py-2 !px-4 !text-xs"
            >
              {isConnected ? 'Disconnect Node' : 'Connect Node'}
            </Button>
          </div>
        </div>

        {/* Dashboard Metric Cards Grid */}
        <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${
          !isConnected ? 'opacity-50 select-none' : ''
        }`}>
          
          {/* Card 1: Latency */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 flex flex-col gap-4 shadow-lg hover:border-[var(--color-accent-teal)]/25 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Translation Latency</span>
              <Activity size={16} className="text-[var(--color-accent-teal)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--color-text-primary)]">{latency}</span>
              <span className="text-xs text-[var(--color-success)]">Optimal</span>
            </div>
            {/* SVG Sparkline */}
            <div className="h-14 flex items-end">
              <svg className="w-full h-full text-[var(--color-accent-teal)] overflow-visible" viewBox="0 0 220 50">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={drawSparkline(latencyData, 120, 200)}
                />
              </svg>
            </div>
          </div>

          {/* Card 2: YOLO FPS */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 flex flex-col gap-4 shadow-lg hover:border-[var(--color-accent-indigo)]/25 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">YOLO Model Rate</span>
              <Cpu size={16} className="text-[var(--color-accent-indigo)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--color-text-primary)]">{yoloFps} FPS</span>
              <span className="text-xs text-[var(--color-text-secondary)]">On-Device WebGL</span>
            </div>
            {/* SVG Sparkline */}
            <div className="h-14 flex items-end">
              <svg className="w-full h-full text-[var(--color-accent-indigo)] overflow-visible" viewBox="0 0 220 50">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={drawSparkline(fpsData, 20, 35)}
                />
              </svg>
            </div>
          </div>

          {/* Card 3: Translations Count */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 flex flex-col gap-4 shadow-lg hover:border-[var(--color-accent-teal)]/25 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Live Translations</span>
              <Database size={16} className="text-[var(--color-accent-teal)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-[var(--color-text-primary)]">
                {translationsCount.toLocaleString()}
              </span>
              <span className="text-xs text-[var(--color-success)]">+Active Session</span>
            </div>
            {/* SVG Sparkline */}
            <div className="h-14 flex items-end">
              <svg className="w-full h-full text-[var(--color-accent-teal)] overflow-visible" viewBox="0 0 220 50">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={drawSparkline(translationsData, 1000, 1300)}
                />
              </svg>
            </div>
          </div>

          {/* Card 4: System Health */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 flex flex-col justify-between shadow-lg hover:border-[var(--color-accent-indigo)]/25 transition-colors min-h-[170px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">Nodes Status</span>
              <CheckCircle2 size={16} className="text-[var(--color-success)]" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-text-secondary)]">Edge YOLO Model:</span>
                <span className="font-semibold text-[var(--color-success)]">Healthy</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-[rgba(255,255,255,0.03)] pt-2 mt-1">
                <span className="text-[var(--color-text-secondary)]">Uptime Telemetry:</span>
                <span className="font-mono font-semibold">{mockMetrics.systemHealth.uptime}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Retraining Pipeline Progress */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 flex flex-col justify-between shadow-lg hover:border-[var(--color-accent-teal)]/25 transition-colors min-h-[170px] md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">YOLO Retraining Pipeline</span>
              <Badge variant="teal" className="uppercase text-[9px] font-bold">
                Epoch {epoch}/10
              </Badge>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-xs text-[var(--color-text-secondary)]">Incremental dataset reinforcement</span>
                <span className="text-xs font-mono font-bold text-[var(--color-accent-teal)]">{trainingProgress}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--color-accent-teal)]"
                  style={{ width: `${trainingProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  )
}
