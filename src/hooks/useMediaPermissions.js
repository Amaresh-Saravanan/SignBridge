import { useState, useCallback } from 'react'

export function useMediaPermissions() {
  const [cameraState, setCameraState] = useState('prompt') // 'prompt' | 'granted' | 'denied'
  const [micState, setMicState] = useState('prompt')

  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(t => t.stop())
      setCameraState('granted')
      return 'granted'
    } catch {
      setCameraState('denied')
      return 'denied'
    }
  }, [])

  const requestMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
      setMicState('granted')
      return 'granted'
    } catch {
      setMicState('denied')
      return 'denied'
    }
  }, [])

  return { cameraState, micState, requestCamera, requestMic }
}
