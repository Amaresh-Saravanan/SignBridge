import { useRef, useEffect, useState, useCallback } from 'react'

export function useAudioVisualizer(barCount = 40) {
  const [amplitudes, setAmplitudes] = useState(() => new Array(barCount).fill(0))
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)
  const streamRef = useRef(null)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 128
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const tick = () => {
        analyser.getByteFrequencyData(dataArray)
        const step = Math.floor(dataArray.length / barCount)
        const bars = []
        for (let i = 0; i < barCount; i++) {
          bars.push(dataArray[i * step] / 255)
        }
        setAmplitudes(bars)
        animationRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      // Mic not available — stay at zero
    }
  }, [barCount])

  const stop = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    if (audioContextRef.current) audioContextRef.current.close()
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setAmplitudes(new Array(barCount).fill(0))
  }, [barCount])

  useEffect(() => {
    return () => stop()
  }, [stop])

  return { amplitudes, start, stop }
}
