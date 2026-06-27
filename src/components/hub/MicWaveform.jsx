import { useEffect } from 'react'
import { useAudioVisualizer } from '../../hooks/useAudioVisualizer'

export default function MicWaveform({ active = false }) {
  const { amplitudes, start, stop } = useAudioVisualizer(40)

  useEffect(() => {
    if (active) {
      start()
    } else {
      stop()
    }
  }, [active, start, stop])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {/* Waveform bars */}
      <div className="flex items-end justify-center gap-[3px] h-32 w-full px-4">
        {amplitudes.map((amp, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-[var(--color-accent)] transition-transform"
            style={{
              height: `${Math.max(4, amp * 100)}%`,
              opacity: 0.4 + amp * 0.6,
              transform: `scaleY(${0.1 + amp * 0.9})`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>

      {/* Status label */}
      <p className="text-caption text-[var(--color-text-secondary)]">
        {active ? 'Listening…' : 'Tap to start speaking'}
      </p>
    </div>
  )
}
