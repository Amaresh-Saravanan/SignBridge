import { useState, useEffect, useEffectEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Settings, Mic, MicOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'

import CameraPreview from '../components/hub/CameraPreview'
import LiveCaptions from '../components/hub/LiveCaptions'
import HubAvatar from '../components/three/HubAvatar'

import { useAppStore } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

export default function Hub() {
  const navigate = useNavigate()
  const { isAdmin } = useAuthStore()

  const isProcessing = useAppStore((s) => s.isProcessing)
  const isSigning = useAppStore((s) => s.isSigning)
  const isListening = useAppStore((s) => s.isListening)
  const replayPhrase = useAppStore((s) => s.replayPhrase)

  const setProcessing = useAppStore((s) => s.setProcessing)
  const setSigning = useAppStore((s) => s.setSigning)
  const setListening = useAppStore((s) => s.setListening)
  const addCaption = useAppStore((s) => s.addCaption)
  const clearReplayPhrase = useAppStore((s) => s.clearReplayPhrase)
  const enqueueGlosses = useAppStore((s) => s.enqueueGlosses)
  const setSentenceType = useAppStore((s) => s.setSentenceType)

  const { transcript, isListening: isSpeechListening, start: startSpeech, stop: stopSpeech, setTranscript } = useSpeechRecognition()
  const [inputText, setInputText] = useState('')

  const triggerSigning = (text, source = 'hearing') => {
    addCaption({ text, source })
    setSigning(true)
    setTimeout(() => setSigning(false), 4000)
  }

  const handleHearingTranslation = async (textToTranslate) => {
    if (!textToTranslate.trim()) return
    setInputText('')
    setTranscript('')
    setProcessing(true)
    let glossTokens = []

    try {
      const response = await fetch('http://localhost:3001/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: textToTranslate })
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const result = await response.json()

      if (result.success && result.data.glosses.length > 0) {
        glossTokens = result.data.glosses.map((g) => g.token)
        enqueueGlosses(glossTokens)

        if (result.data.nmm) {
          const hasQuestion = result.data.nmm.eyebrows !== 'neutral'
          const hasNegation = result.data.nmm.head === 'shaking'
          if (hasQuestion) setSentenceType('yes_no_question')
          else if (hasNegation) setSentenceType('negation')
          else setSentenceType(null)
        }
      }

      addCaption({ text: textToTranslate, source: 'hearing' })
      setSigning(true)
      setTimeout(() => setSigning(false), glossTokens.length * 1200)
    } catch (error) {
      console.error('Translation error:', error)
      addCaption({ text: textToTranslate + ' (translation failed)', source: 'hearing' })
    } finally {
      setProcessing(false)
    }
  }

  const replayPhraseEffect = useEffectEvent(() => {
    triggerSigning(replayPhrase, 'hearing')
    clearReplayPhrase()
  })

  const speechStoppedEffect = useEffectEvent((spokenText) => {
    void handleHearingTranslation(spokenText)
  })

  // Replay phrase from History page
  useEffect(() => {
    if (replayPhrase) {
      replayPhraseEffect()
    }
  }, [replayPhrase])

  useEffect(() => {
    if (!isSpeechListening) {
      setListening(false)
    }
  }, [isSpeechListening, setListening])

  useEffect(() => {
    if (isSpeechListening) return
    if (!transcript.trim()) return

    const timeoutId = setTimeout(() => {
      speechStoppedEffect(transcript)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [isSpeechListening, transcript])

  const toggleListening = () => {
    if (isSpeechListening) {
      setListening(false)
      stopSpeech()
      return
    }

    setTranscript('')
    setListening(true)
    startSpeech()
  }

  return (
    <PageWrapper className="relative min-h-screen bg-bg-base text-text-primary flex flex-col">
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between p-6 pointer-events-none">
        <button 
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center pointer-events-auto backdrop-blur-md"
        >
          <Settings size={20} />
        </button>
        {isAdmin && (
          <Button variant="secondary" onClick={() => navigate('/admin/dashboard')} className="py-1.5! px-4! min-h-0! text-xs! pointer-events-auto backdrop-blur-md rounded-full shadow-lg">
            Admin
          </Button>
        )}
      </div>

      {/* Top Zone: 3D Avatar Area */}
      <div className="relative w-full h-[50vh] min-h-100 bg-surface rounded-b-[40px] shadow-elevated flex items-center justify-center overflow-visible border-b border-border">
        
        {/* ISL Dropdown Pill */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-border rounded-full text-caption font-semibold shadow-card cursor-pointer hover:border-accent transition-colors backdrop-blur-md">
          <span className="text-body leading-none">🇮🇳</span> ISL
          <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full pb-8 pt-4">
          <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} className="w-full h-full">
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />
            <HubAvatar />
          </Canvas>
        </div>

        {/* Processing Badge Overlay */}
        <AnimatePresence>
          {(isProcessing || isSigning) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-bg-base border border-accent/30 text-[11px] uppercase tracking-wider font-bold shadow-lg"
            >
              {isProcessing ? (
                <span className="text-warning animate-pulse">Processing…</span>
              ) : (
                <span className="text-accent animate-pulse">Signing…</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlapping Circular Camera Feed */}
         <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-bg-base overflow-hidden bg-surface-elevated shadow-[0_12px_24px_rgba(0,0,0,0.4)] z-30 flex items-center justify-center">
           <div className="w-full h-full scale-[1.5]">
             <CameraPreview active={true} />
           </div>
        </div>
      </div>

      {/* Interaction Controls Zone */}
       <div className="w-full flex-1 flex flex-col items-center pt-20 px-6 pb-6 gap-6 max-w-125 mx-auto">
        
        {/* Glowing Mic Button */}
        <div className="relative">
          {/* Ambient Glow */}
          <div className={`absolute inset-0 rounded-full bg-accent opacity-30 blur-xl transition-all duration-500 ${isListening ? 'scale-[1.8] animate-pulse' : 'scale-[1.2]'}`} />
          
          <button
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-accent text-bg-base scale-95 shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)]' 
                : 'bg-linear-to-b from-accent to-[#b57a34] text-bg-base shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_24px_rgba(201,138,62,0.4)] hover:brightness-110'
            }`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
        </div>

        {/* Text Input Pill */}
        <div className="w-full relative mt-2">
           <form onSubmit={(e) => { e.preventDefault(); handleHearingTranslation(inputText) }}>
             <input
               type="text"
               placeholder="Type your manualting..."
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-surface border border-border rounded-full px-6 py-4 text-sm focus:border-accent outline-none shadow-card backdrop-blur-md placeholder:text-text-disabled"
              />
            </form>
         </div>

         {/* Real-time Transcript Window */}
         <div className="w-full bg-surface border border-border rounded-lg p-5 shadow-elevated flex flex-col flex-1 max-h-87.5 min-h-62.5 backdrop-blur-md">
          <div className="flex items-center justify-center pb-4 mb-2">
            <span className="text-sm font-semibold text-text-primary">Real-time transcript</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
             <LiveCaptions />
          </div>
        </div>
        
      </div>
    </PageWrapper>
  )
}
