import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Settings, History, Mic, MicOff, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

import PageWrapper from '../components/layout/PageWrapper'
import SegmentedControl from '../components/ui/SegmentedControl'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ProcessingPulse from '../components/ui/ProcessingPulse'
import WaveformMotif from '../components/ui/WaveformMotif'

import MicWaveform from '../components/hub/MicWaveform'
import CameraPreview from '../components/hub/CameraPreview'
import LiveCaptions from '../components/hub/LiveCaptions'
import HubAvatar from '../components/three/HubAvatar'

import { useAppStore } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { dialects } from '../data/mockData'

export default function Hub() {
  const { isAdmin } = useAuthStore()

  const role = useAppStore((s) => s.role)
  const dialect = useAppStore((s) => s.dialect)
  const isProcessing = useAppStore((s) => s.isProcessing)
  const isSigning = useAppStore((s) => s.isSigning)
  const isListening = useAppStore((s) => s.isListening)
  const hubMode = useAppStore((s) => s.hubMode)
  const replayPhrase = useAppStore((s) => s.replayPhrase)

  const setHubMode = useAppStore((s) => s.setHubMode)
  const setProcessing = useAppStore((s) => s.setProcessing)
  const setSigning = useAppStore((s) => s.setSigning)
  const setListening = useAppStore((s) => s.setListening)
  const addCaption = useAppStore((s) => s.addCaption)
  const clearCaptions = useAppStore((s) => s.clearCaptions)
  const clearReplayPhrase = useAppStore((s) => s.clearReplayPhrase)

  const { transcript, isListening: isSpeechListening, start: startSpeech, stop: stopSpeech, setTranscript } = useSpeechRecognition()
  const [inputText, setInputText] = useState('')

  const dialectLabel = dialects.find((d) => d.value === dialect)?.label || dialect

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

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
    await new Promise((r) => setTimeout(r, 900))
    setProcessing(false)
    triggerSigning(textToTranslate, 'hearing')
  }

  const handleDeafSignGesture = async (signText) => {
    if (isProcessing) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 900))
    setProcessing(false)
    addCaption({ text: signText, source: 'deaf' })
    speakText(signText)
  }

  // Replay phrase from History page
  useEffect(() => {
    if (replayPhrase) {
      triggerSigning(replayPhrase, 'hearing')
      clearReplayPhrase()
    }
  }, [replayPhrase])

  useEffect(() => {
    if (!isSpeechListening && transcript.trim()) {
      handleHearingTranslation(transcript)
    }
    setListening(isSpeechListening)
  }, [isSpeechListening])

  const toggleListening = () => {
    if (isListening) stopSpeech()
    else {
      setTranscript('')
      startSpeech()
    }
  }

  const demoPhrases = [
    { text: 'Hello', label: 'Hello' },
    { text: 'Thank you', label: 'Thank you' },
    { text: 'Water', label: 'Water' },
    { text: 'Help', label: 'Help' },
    { text: 'Doctor', label: 'Doctor' },
    { text: 'Yes', label: 'Yes' },
    { text: 'No', label: 'No' },
  ]

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 px-6">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap select-none">
            <Badge role={role} />
            <span className="text-caption text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-2.5 py-1 rounded-[var(--radius-sm)]">
              {dialectLabel}
            </span>
            <span 
              className="text-caption text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)] border border-[var(--color-accent)]/20 px-2.5 py-1 rounded-[var(--radius-sm)] flex items-center gap-1.5 cursor-help transition-all hover:border-[var(--color-accent)]/45" 
              title="Warm & Friendly: Adjusts avatar facial expressions to be more encouraging and approachable. Change in Settings."
            >
              😊 Warm &amp; Friendly tone
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/history" title="History & phrasebook">
              <Button variant="ghost" className="!p-2.5 min-h-[40px] min-w-[40px] border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 rounded-[var(--radius-default)]" aria-label="History & phrasebook">
                <History size={18} />
              </Button>
            </Link>
            <Link to="/settings" title="Settings">
              <Button variant="ghost" className="!p-2.5 min-h-[40px] min-w-[40px] border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 rounded-[var(--radius-default)]" aria-label="Settings">
                <Settings size={18} />
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard">
                <Button variant="secondary" className="!py-2 !px-3 !text-xs ml-1 min-h-[40px]">
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
 
      {/* Two-zone layout: ~55% input / ~45% avatar */}
      <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input zone — stacks above avatar on mobile */}
        <div className="lg:col-span-7 flex flex-col gap-6 order-1">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 md:p-8 flex flex-col gap-6 shadow-card flex-1">
            <div className="flex items-center justify-between gap-3 flex-wrap pb-2 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <h3 className="h3 font-display">Source Input</h3>
                <WaveformMotif state={isListening ? 'listening' : isSigning ? 'active' : 'idle'} size={24} />
              </div>
              <SegmentedControl
                options={[
                  { value: 'speak', label: '🎤 Speak' },
                  { value: 'sign', label: '✋ Sign' },
                ]}
                value={hubMode}
                onChange={setHubMode}
                layoutId="hub-mode-toggle"
              />
            </div>
 
            <ProcessingPulse active={isProcessing} className="flex-1 rounded-[var(--radius-default)]">
              <div className="flex-1 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-[var(--radius-default)] overflow-hidden relative min-h-[280px] h-full">
                <AnimatePresence mode="wait">
                  {hubMode === 'speak' ? (
                    <motion.div key="waveform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full p-6 min-h-[280px]">
                      <MicWaveform active={isListening} />
                    </motion.div>
                  ) : (
                    <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full min-h-[280px]">
                      <CameraPreview active={hubMode === 'sign'} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ProcessingPulse>
 
            {hubMode === 'speak' ? (
              <div className="flex flex-col gap-4">
                {transcript && (
                  <div className="flex flex-col gap-3 p-4 bg-[var(--color-accent-soft)] text-[var(--color-text-primary)] border border-[var(--color-accent)]/10 rounded-[var(--radius-default)] min-h-[80px] text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-semibold uppercase tracking-wider text-[var(--color-accent)]">Live Transcript</span>
                      <span
                        className="text-caption font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-border)] cursor-help"
                        title="Avatar expressions adjust dynamically to match a friendly and encouraging tone."
                      >
                        😊 Friendly &amp; Warm tone
                      </span>
                    </div>
                    <p className="text-body leading-relaxed font-medium">
                      &ldquo;{transcript}&rdquo;
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isListening
                        ? 'bg-[var(--color-error)] text-white shadow-lg'
                        : 'bg-[var(--color-accent)] text-[var(--color-bg-base)] shadow-md hover:brightness-110'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start speaking'}
                  >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleHearingTranslation(inputText) }}
                    className="flex-1 flex gap-3"
                  >
                    <input
                      type="text"
                      placeholder="Or type a phrase for the avatar to sign…"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface-elevated)] text-body border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none min-h-[56px]"
                    />
                    <Button type="submit" variant="secondary" className="!p-4 shrink-0 min-h-[56px] min-w-[56px] flex items-center justify-center rounded-[var(--radius-input)]">
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)]">Demo gesture triggers:</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {demoPhrases.map((phrase) => (
                    <button
                      key={phrase.text}
                      type="button"
                      onClick={() => handleDeafSignGesture(phrase.text)}
                      disabled={isProcessing}
                      className="px-2 py-2.5 text-caption font-semibold rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all cursor-pointer disabled:opacity-40 min-h-[44px]"
                    >
                      {phrase.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
 
        {/* Avatar + captions zone */}
        <div className="lg:col-span-5 flex flex-col gap-4 order-2">
          <ProcessingPulse active={isProcessing || isSigning} className="rounded-[var(--radius-default)] flex-1">
            <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-[var(--radius-default)] overflow-hidden flex flex-col relative min-h-[280px] shadow-card flex-1 p-4">
              <div className="absolute top-7 right-7 z-20 pointer-events-none">
                <span className="text-caption uppercase font-semibold px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)]">
                  {isProcessing ? (
                    <span className="text-[var(--color-warning)]">Processing…</span>
                  ) : isSigning ? (
                    <span className="text-[var(--color-accent)]">Signing…</span>
                  ) : (
                    <span className="text-[var(--color-text-secondary)]">Idle</span>
                  )}
                </span>
              </div>
              <div className="flex-1 w-full min-h-[240px] aspect-[4/3]">
                <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} className="w-full h-full">
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[5, 10, 5]} intensity={1.5} />
                  <pointLight position={[-5, 5, -5]} intensity={0.5} />
                  <HubAvatar />
                </Canvas>
              </div>
            </div>
          </ProcessingPulse>
 
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-4 flex flex-col gap-3 shadow-card min-h-[160px] max-h-[240px] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <span className="text-caption font-semibold">Live Captions</span>
              <button
                type="button"
                onClick={clearCaptions}
                className="text-caption text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors cursor-pointer min-h-[44px] px-2"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LiveCaptions />
            </div>
            <p className="text-caption text-[var(--color-text-disabled)]">Tap and hold a caption to copy</p>
          </div>

          {/* Report Incorrect Sign button */}
          <div className="border-t border-[var(--color-border)] pt-4 mt-4">
            <Button
              variant="ghost"
              className="w-full text-caption text-[var(--color-error)] hover:bg-[var(--color-error)]/10 flex items-center justify-center gap-2 min-h-[44px] rounded-[var(--radius-sm)]"
              onClick={() => alert('Sign reported. Thank you for your feedback!')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Report incorrect sign
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
