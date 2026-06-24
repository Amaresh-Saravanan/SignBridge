import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Video, VideoOff, RefreshCw, Save, CheckCircle2, Circle } from 'lucide-react'

import PageWrapper from '../../components/layout/PageWrapper'
import AdminMobileNotice from '../../components/admin/AdminMobileNotice'
import Button from '../../components/ui/Button'
import { useToastStore } from '../../stores/toastStore'

export default function Collector() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addToast = useToastStore((s) => s.addToast)

  // Target word to record (query param or default)
  const targetWord = searchParams.get('word') || 'Goodbye'

  // Webcam stream state
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [camError, setCamError] = useState(false)

  // Recording status
  const [isRecording, setIsRecording] = useState(false)
  const [recordDuration, setRecordDuration] = useState(0) // in tenths of a second
  const [hasRecorded, setHasRecorded] = useState(false)
  const [saving, setSaving] = useState(false)

  // Scrubber control mock state
  const [scrubberVal, setScrubberVal] = useState(0)
  const [isPlayingBack, setIsPlayingBack] = useState(false)

  // Start webcam automatically on load
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        setStream(s)
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch((err) => {
        setCamError(true)
      })

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // Timer effect for recording state
  useEffect(() => {
    let interval
    if (isRecording) {
      setRecordDuration(0)
      interval = setInterval(() => {
        setRecordDuration((d) => d + 1)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Mock video playback timeline effect
  useEffect(() => {
    let interval
    if (isPlayingBack) {
      interval = setInterval(() => {
        setScrubberVal((val) => {
          if (val >= 100) {
            return 0 // Loop
          }
          return val + 2
        })
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isPlayingBack])

  const startRecording = () => {
    setHasRecorded(false)
    setIsRecording(true)
    setIsPlayingBack(false)
    setScrubberVal(0)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setHasRecorded(true)
    setIsPlayingBack(true)
  }

  const handleSaveToDataset = async () => {
    setSaving(true)
    // Simulated upload of gesture dataset files
    await new Promise((r) => setTimeout(r, 1400))
    setSaving(false)
    addToast({
      type: 'success',
      message: `Gesture file for "${targetWord}" saved to retraining pipeline!`,
      duration: 3000,
    })
    navigate('/admin/dictionary')
  }

  const formatTimer = (ticks) => {
    const totalSecs = Math.floor(ticks / 10)
    const tenths = ticks % 10
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
  }

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg py-12 px-6 md:px-12">
      <AdminMobileNotice />
      <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/admin/dictionary')}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer outline-none group"
          aria-label="Go back to Dictionary"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Dictionary
        </button>

        {/* Word header */}
        <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 shadow-md flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--color-accent-indigo)]">Recording Task</span>
            <h2 className="text-xl font-bold">
              Record gesture mapping for: <span className="text-[var(--color-accent-teal)]">"{targetWord}"</span>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-[rgba(63,214,192,0.05)] border border-[rgba(63,214,192,0.1)] flex items-center justify-center text-[var(--color-accent-teal)] shrink-0">
            <Video size={18} />
          </div>
        </div>

        {/* Webcam recording terminal viewport */}
        <div className={`w-full aspect-video rounded-[var(--radius-default)] overflow-hidden bg-[var(--color-bg-base)] border relative shadow-2xl transition-all duration-300 ${
          isRecording
            ? 'border-[var(--color-recording-red)] shadow-[0_0_24px_rgba(239,68,68,0.2)]'
            : 'border-[var(--color-border)]'
        }`}>
          {camError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-3 text-[var(--color-text-secondary)]">
              <VideoOff size={48} className="text-[var(--color-error)]" />
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">Camera Access Required</h3>
              <p className="text-xs max-w-xs">
                Ensure camera permissions are enabled in your browser settings to proceed with gesture collection.
              </p>
            </div>
          ) : (
            <>
              {/* Webcam Feed Video */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Pulsing indicator during active record */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 border-4 border-[var(--color-recording-red)] pointer-events-none z-10"
                  >
                    {/* Live recording red dot + timer */}
                    <div className="absolute top-4 left-4 bg-[rgba(14,15,17,0.85)] border border-[rgba(239,68,68,0.3)] rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-recording-red)] animate-ping absolute" />
                      <Circle size={10} className="fill-[var(--color-recording-red)] text-[var(--color-recording-red)]" />
                      <span className="text-[var(--color-recording-red)] tracking-wider">REC</span>
                      <span className="text-white border-l border-[var(--color-border)] pl-2 font-mono">
                        {formatTimer(recordDuration)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Review / Scrubber state when recorded */}
              {hasRecorded && isPlayingBack && (
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent z-10 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-white">
                    <span>Preview Loop</span>
                    <span>100%</span>
                  </div>
                  {/* Custom progress bar scrubber input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scrubberVal}
                    onChange={(e) => {
                      setIsPlayingBack(false)
                      setScrubberVal(Number(e.target.value))
                    }}
                    className="w-full h-1 bg-[rgba(255,255,255,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-teal)]"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Action controllers */}
        <div className="w-full flex justify-center items-center gap-4 py-2">
          {!hasRecorded && !isRecording ? (
            <Button
              variant="destructive"
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-2 !py-4"
              disabled={camError}
            >
              <Circle size={14} className="fill-white" />
              Start Recording Gesture
            </Button>
          ) : isRecording ? (
            <Button
              variant="primary"
              onClick={stopRecording}
              className="w-full flex items-center justify-center gap-2 !py-4 bg-[var(--color-recording-red)] text-white hover:bg-[var(--color-recording-red)]/90"
            >
              <span className="w-3 h-3 bg-white rounded-sm" />
              Stop and Review Gesture
            </Button>
          ) : (
            <div className="w-full flex gap-3">
              <Button
                variant="secondary"
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={16} />
                Re-record
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveToDataset}
                loading={saving}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <Save size={16} />
                {saving ? 'Uploading...' : 'Save to Dataset'}
              </Button>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  )
}
