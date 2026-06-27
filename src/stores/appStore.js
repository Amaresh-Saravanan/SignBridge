import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // Role & Dialect
  role: 'deaf', // 'deaf' | 'hearing'
  dialect: 'ISL',
  speechLanguage: 'English',

  // Hub state
  hubMode: 'speak', // 'speak' | 'sign'
  isProcessing: false,
  isSigning: false,
  isListening: false,

  // Caption history for current session
  captions: [],

  // Settings
  contextPreset: 'everyday', // 'everyday' | 'medical' | 'education' | 'legal'
  captionSize: 'medium', // 'small' | 'medium' | 'large'
  showCaptions: true,
  reduceMotion: false,

  // Avatar customization
  skinTone: 0,
  outfitColor: 0,

  // Animation state
  currentGloss: null,
  glossQueue: [],
  isAnimating: false,
  sentenceType: null,
  animProgress: 0,

  // History replay — set by History page, consumed by Hub on mount
  replayPhrase: null,

  // Actions
  setRole: (role) => set({ role }),
  setDialect: (dialect) => set({ dialect }),
  setSpeechLanguage: (lang) => set({ speechLanguage: lang }),
  setHubMode: (mode) => set({ hubMode: mode }),
  setProcessing: (v) => set({ isProcessing: v }),
  setSigning: (v) => set({ isSigning: v }),
  setListening: (v) => set({ isListening: v }),
  setContextPreset: (preset) => set({ contextPreset: preset }),
  setCaptionSize: (size) => set({ captionSize: size }),
  setShowCaptions: (v) => set({ showCaptions: v }),
  setReduceMotion: (v) => set({ reduceMotion: v }),
  setSkinTone: (tone) => set({ skinTone: tone }),
  setOutfitColor: (color) => set({ outfitColor: color }),

  addCaption: (caption) => set((state) => ({
    captions: [...state.captions, {
      id: Date.now(),
      text: caption.text,
      source: caption.source, // 'deaf' | 'hearing'
      timestamp: new Date().toLocaleTimeString(),
    }]
  })),

  clearCaptions: () => set({ captions: [] }),

  setReplayPhrase: (phrase) => set({ replayPhrase: phrase }),
  clearReplayPhrase: () => set({ replayPhrase: null }),

  setCurrentGloss: (gloss) => set({ currentGloss: gloss }),
  setGlossQueue: (queue) => set({ glossQueue: queue }),
  setIsAnimating: (v) => set({ isAnimating: v }),
  setSentenceType: (type) => set({ sentenceType: type }),
  setAnimProgress: (p) => set({ animProgress: p }),

  enqueueGlosses: (glosses) => set((state) => ({
    glossQueue: [...state.glossQueue, ...glosses]
  })),
  dequeueGloss: () => set((state) => {
    const [next, ...rest] = state.glossQueue
    return { currentGloss: next || null, glossQueue: rest }
  }),
  clearGlossQueue: () => set({ glossQueue: [], currentGloss: null, isAnimating: false }),
}))
