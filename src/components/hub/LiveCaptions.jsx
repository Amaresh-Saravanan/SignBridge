import { useRef, useEffect, useState, useCallback } from 'react'
import { useAppStore } from '../../stores/appStore'

export default function LiveCaptions() {
  const captions = useAppStore((s) => s.captions)
  const scrollRef = useRef(null)
  const [copiedId, setCopiedId] = useState(null)
  const holdTimer = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [captions])

  const copyCaption = useCallback(async (caption) => {
    try {
      await navigator.clipboard.writeText(caption.text)
      setCopiedId(caption.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }, [])

  const handlePointerDown = (caption) => {
    holdTimer.current = setTimeout(() => copyCaption(caption), 500)
  }

  const handlePointerUp = () => {
    clearTimeout(holdTimer.current)
  }

  if (captions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-[var(--color-text-secondary)] text-center text-body">
          Say or sign something to get started
        </p>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex flex-col gap-3 p-2 overflow-y-auto max-h-48">
      {captions.map((cap) => (
        <div
          key={cap.id}
          className="relative group select-none touch-none"
          onPointerDown={() => handlePointerDown(cap)}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <p
            className="text-live-caption leading-relaxed"
            style={{
              color: cap.source === 'deaf'
                ? 'var(--color-text-primary)'
                : 'var(--color-accent)',
            }}
          >
            {cap.text}
          </p>
          <span className="text-caption text-[var(--color-text-secondary)] font-mono">{cap.timestamp}</span>

          {copiedId === cap.id && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-caption bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)] px-2 py-0.5 rounded-[var(--radius-sm)] shadow-card">
              Copied
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
