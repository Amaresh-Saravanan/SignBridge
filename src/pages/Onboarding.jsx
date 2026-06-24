import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, Mic, ShieldCheck, Heart, Check } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import { useMediaPermissions } from '../hooks/useMediaPermissions'

export default function Onboarding() {
  const navigate = useNavigate()
  const { cameraState, micState, requestCamera, requestMic } = useMediaPermissions()

  const allGranted = cameraState === 'granted' && micState === 'granted'

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg flex flex-col py-12 px-4 md:px-12">
      
      {/* Brand Header */}
      <div className="w-full flex justify-center mb-12">
        <h1 className="h3 font-display tracking-tight font-semibold">SignBridge</h1>
      </div>

      {/* 4-Step Indicator */}
      <div className="w-full max-w-[600px] mx-auto flex items-center justify-between relative mb-16 px-4">
        {/* Connecting Lines */}
        <div className="absolute left-[10%] right-[10%] top-3 h-[2px] bg-[var(--color-border)] -z-10" />
        <div className="absolute left-[10%] right-[50%] top-3 h-[2px] bg-[var(--color-accent)] -z-10 shadow-[0_0_8px_var(--color-accent)]" />

        {/* Steps */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-[0_0_12px_rgba(201,138,62,0.4)]">
            <Check size={14} className="text-[var(--color-bg-base)]" strokeWidth={3} />
          </div>
          <span className="text-caption text-[var(--color-text-secondary)]">Welcome</span>
        </div>

        <div className="flex flex-col items-center gap-3 relative">
          <div className="w-6 h-6 rounded-full bg-[var(--color-bg-base)] border-[2px] border-[var(--color-accent)] flex items-center justify-center shadow-[0_0_16px_rgba(201,138,62,0.5)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
          </div>
          <span className="text-caption text-[var(--color-text-primary)] font-medium">Permissions</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[var(--color-border)] flex items-center justify-center" />
          <span className="text-caption text-[var(--color-text-disabled)]">Preferences</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[var(--color-border)] flex items-center justify-center" />
          <span className="text-caption text-[var(--color-text-disabled)]">Ready</span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-[540px] mx-auto">
        <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 md:p-8 shadow-elevated flex flex-col gap-8 relative overflow-hidden">
          
          <h2 className="text-3xl font-display font-medium text-center">Let&apos;s Set You Up</h2>

          <div className="flex flex-col gap-4">
            
            {/* Camera Access Inner Card */}
            <div className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-inner)] p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-[10px] bg-[var(--color-bg-base)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
                    <Camera size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Camera Access</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Required for sign-to-text translation. We process everything locally — your video never leaves your device.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center border border-[var(--color-border)] rounded-md px-2 py-1 bg-[rgba(255,255,255,0.03)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
                  <ShieldCheck size={12} className="mb-0.5 text-[var(--color-success)]" />
                  100%<br/>Private
                </div>
              </div>
              
              <div className="w-full flex justify-center mt-2">
                {cameraState === 'granted' ? (
                  <div className="px-6 py-2 rounded-full text-sm font-semibold bg-[rgba(76,175,130,0.15)] text-[var(--color-success)] border border-[var(--color-success)]/30 flex items-center gap-2">
                    <Check size={16} /> Access Granted
                  </div>
                ) : (
                  <Button variant="primary" onClick={requestCamera} className="w-[80%] !py-2.5 text-sm">
                    Allow Camera
                  </Button>
                )}
              </div>
            </div>

            {/* Microphone Access Inner Card */}
            <div className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-inner)] p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-[10px] bg-[var(--color-bg-base)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
                    <Mic size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Microphone Access</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Required for voice-to-sign translation. Speech is processed in your browser.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center border border-[var(--color-border)] rounded-md px-2 py-1 bg-[rgba(255,255,255,0.03)] text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
                  <ShieldCheck size={12} className="mb-0.5 text-[var(--color-success)]" />
                  100%<br/>Private
                </div>
              </div>
              
              <div className="w-full flex justify-center mt-2">
                {micState === 'granted' ? (
                  <div className="px-6 py-2 rounded-full text-sm font-semibold bg-[rgba(76,175,130,0.15)] text-[var(--color-success)] border border-[var(--color-success)]/30 flex items-center gap-2">
                    <Check size={16} /> Access Granted
                  </div>
                ) : (
                  <Button variant="primary" onClick={requestMic} className="w-[80%] !py-2.5 text-sm">
                    Allow Microphone
                  </Button>
                )}
              </div>
            </div>

          </div>

          <div className="flex items-center gap-3 mt-4 pt-6 border-t border-[var(--color-border)]/50">
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <Heart size={14} className="text-[var(--color-text-secondary)]" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-tight">
              Your privacy matters. All processing happens on your device. Nothing is uploaded.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 w-full">
          <Button 
            variant="primary" 
            onClick={() => navigate('/hub')} 
            className="w-[200px]"
            disabled={!allGranted}
          >
            Continue
          </Button>
          <button 
            onClick={() => navigate('/hub')}
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline underline-offset-4 decoration-[var(--color-border)] hover:decoration-[var(--color-text-primary)] transition-all"
          >
            Skip for now
          </button>
        </div>

      </div>
    </PageWrapper>
  )
}
