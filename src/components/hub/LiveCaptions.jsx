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
        <p className="text-text-secondary text-center text-body">
          Say or sign something to get started
        </p>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex flex-col gap-4 p-2 overflow-y-auto" aria-live="polite">
      {captions.map((cap) => {
        const isUser = cap.source === 'hearing'
        return (
          <div
            key={cap.id}
            className={`relative group select-none touch-none flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            onPointerDown={() => handlePointerDown(cap)}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div 
              className={`px-4 py-2.5 rounded-2xl max-w-[85%] ${
                isUser 
                  ? 'bg-accent text-bg-base rounded-br-sm'
                  : 'bg-[rgba(201,138,62,0.15)] text-accent border border-accent/20 rounded-bl-sm'
              }`}
            >
              <p className="text-sm font-medium leading-relaxed">
                {cap.text}
              </p>
            </div>
            
            {copiedId === cap.id && (
              <span className="absolute -top-8 bg-surface border border-border text-text-primary px-2 py-0.5 rounded-sm shadow-card text-xs">
                Copied
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
