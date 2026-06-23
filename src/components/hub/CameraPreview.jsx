import { useRef, useEffect, useState } from 'react'

export default function CameraPreview({ active = false }) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    if (active) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          setStream(s)
          if (videoRef.current) {
            videoRef.current.srcObject = s
          }
        })
        .catch(() => {})
    } else {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
        setStream(null)
      }
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [active])

  return (
    <div className="relative flex flex-col items-center justify-center h-full overflow-hidden rounded-[var(--radius-default)]">
      {active ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-[var(--radius-default)] scale-x-[-1]"
          />
          {/* Top row with LIVE badge and camera icon */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-white bg-[var(--color-error-shade)] px-2 py-0.5 rounded-[var(--radius-sm)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
            <div className="text-white bg-[rgba(14,15,17,0.5)] p-1.5 rounded-full">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {/* Mock keypoint overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-3/5 h-3/5 opacity-50" viewBox="0 0 200 300">
              {/* Simple skeleton lines */}
              <circle cx="100" cy="40" r="5" fill="var(--color-accent)" />
              <line x1="100" y1="45" x2="100" y2="120" stroke="var(--color-accent)" strokeWidth="2" />
              <line x1="100" y1="70" x2="55" y2="110" stroke="var(--color-accent)" strokeWidth="2" />
              <line x1="100" y1="70" x2="145" y2="110" stroke="var(--color-accent)" strokeWidth="2" />
              <line x1="100" y1="120" x2="70" y2="200" stroke="var(--color-accent)" strokeWidth="2" />
              <line x1="100" y1="120" x2="130" y2="200" stroke="var(--color-accent)" strokeWidth="2" />
              {/* Joint dots */}
              <circle cx="55" cy="110" r="4" fill="var(--color-accent)" />
              <circle cx="145" cy="110" r="4" fill="var(--color-accent)" />
              <circle cx="100" cy="70" r="3" fill="var(--color-accent)" />
              <circle cx="100" cy="120" r="3" fill="var(--color-accent)" />
              <circle cx="70" cy="200" r="4" fill="var(--color-accent)" />
              <circle cx="130" cy="200" r="4" fill="var(--color-accent)" />
            </svg>
          </div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-caption text-[var(--color-text-secondary)] bg-[rgba(14,15,17,0.7)] px-3 py-1 rounded-full">
            Detecting signs…
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-caption">Camera preview will appear here</p>
        </div>
      )}
    </div>
  )
}
