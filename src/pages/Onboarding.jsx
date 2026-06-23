import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, Mic, AlertTriangle } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import PermissionGranted from '../components/onboarding/PermissionGranted'
import { useMediaPermissions } from '../hooks/useMediaPermissions'

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const { cameraState, micState, requestCamera, requestMic } = useMediaPermissions()

  const handleCameraRequest = async () => {
    const res = await requestCamera()
    if (res === 'granted') {
      setTimeout(() => setStep(2), 600)
    }
  }

  const handleMicRequest = async () => {
    const res = await requestMic()
    if (res === 'granted') {
      setTimeout(() => navigate('/hub'), 600)
    }
  }

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  }

  const renderIcon = (type, state) => {
    if (state === 'granted') return <PermissionGranted />
    if (state === 'denied') {
      return (
        <div className="w-16 h-16 rounded-full bg-[var(--color-error-tint)] border border-[var(--color-error)] flex items-center justify-center text-[var(--color-error)] animate-bounce">
          <AlertTriangle size={32} />
        </div>
      )
    }
    const Icon = type === 'camera' ? Camera : Mic
    return (
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-[var(--color-accent)]/20 shadow-sm">
        <Icon size={32} />
      </div>
    )
  }

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg flex flex-col py-16 px-6 md:px-12">
      {/* 2-step progress dots */}
      <div className="flex flex-col items-center gap-3 mb-12 select-none">
        <span className="text-xs uppercase tracking-wider font-bold text-[var(--color-accent)]">
          Step {step} of 2
        </span>
        <div className="flex items-center gap-3">
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[var(--color-accent)] w-10' : 'bg-[var(--color-border)] w-2'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'bg-[var(--color-accent)] w-10' : 'bg-[var(--color-border)] w-2'}`} />
        </div>
      </div>
 
      <div className="flex-1 flex items-center justify-center max-w-[500px] mx-auto w-full">
        <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 md:p-10 shadow-card min-h-[400px] flex flex-col justify-center gap-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-camera"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center text-center gap-6"
              >
                {renderIcon('camera', cameraState)}
 
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-display font-medium">Allow camera access</h3>
                  <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                    We use your camera to translate your sign language gestures in real time. Your video feed is processed entirely on your device—nothing is ever recorded, stored, or sent to the cloud.
                  </p>
                </div>
 
                {cameraState === 'denied' && (
                  <p className="text-caption text-[var(--color-error)] bg-[var(--color-error-tint)] border border-[var(--color-error)]/20 rounded-[var(--radius-sm)] px-4 py-2.5">
                    Camera access is blocked. Open your browser&apos;s site settings to allow it, then refresh the page.
                  </p>
                )}
 
                <div className="w-full pt-2">
                  {cameraState === 'denied' ? (
                    <Button variant="primary" onClick={handleCameraRequest} className="w-full">
                      Try again
                    </Button>
                  ) : cameraState === 'granted' ? (
                    <Button variant="ghost" disabled className="w-full text-[var(--color-success)]">
                      Camera access granted
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleCameraRequest} className="w-full">
                      Allow camera access
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
 
            {step === 2 && (
              <motion.div
                key="step-mic"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center text-center gap-6"
              >
                {renderIcon('mic', micState)}
 
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-display font-medium">Allow microphone access</h3>
                  <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                    We use your microphone to capture spoken sentences so the 3D avatar can sign them. Your audio is analyzed in real time on your device and is never stored.
                  </p>
                </div>
 
                {micState === 'denied' && (
                  <p className="text-caption text-[var(--color-error)] bg-[var(--color-error-tint)] border border-[var(--color-error)]/20 rounded-[var(--radius-sm)] px-4 py-2.5">
                    Microphone access is blocked. Open your browser&apos;s site settings to allow it, then refresh the page.
                  </p>
                )}
 
                <div className="w-full pt-2">
                  {micState === 'denied' ? (
                    <Button variant="primary" onClick={handleMicRequest} className="w-full">
                      Try again
                    </Button>
                  ) : micState === 'granted' ? (
                    <Button variant="ghost" disabled className="w-full text-[var(--color-success)]">
                      Microphone access granted
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleMicRequest}
                      className="w-full"
                      disabled={cameraState !== 'granted'}
                    >
                      Allow microphone access
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  )
}
