import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Calendar, Play, AlertCircle, MessageSquare } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import WaveformMotif from '../components/ui/WaveformMotif'

import { useAppStore } from '../stores/appStore'
import { mockHistory } from '../data/mockData'

export default function History() {
  const navigate = useNavigate()
  const setReplayPhrase = useAppStore((s) => s.setReplayPhrase)

  const [historyItems, setHistoryItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replayingId, setReplayingId] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [filterChip, setFilterChip] = useState('all')
  const [savedIds, setSavedIds] = useState([2, 4]) // Mock saved phrases

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setHistoryItems(mockHistory)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleReplaySign = (item) => {
    setReplayingId(item.id)
    setReplayPhrase(item.phrase)
    setTimeout(() => navigate('/hub'), 300)
  }

  const filtered = historyItems.filter((item) => {
    // Search match
    const searchMatch =
      item.preview.toLowerCase().includes(search.toLowerCase()) ||
      item.phrase.toLowerCase().includes(search.toLowerCase())

    // Tab match
    const isSaved = savedIds.includes(item.id)
    const tabMatch = activeTab === 'all' || (activeTab === 'saved' && isSaved)

    // Chip tag match
    const tag = item.phrase.length > 15 ? 'medical' : 'everyday'
    const chipMatch = filterChip === 'all' || filterChip === tag

    return searchMatch && tabMatch && chipMatch
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  }

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] bg-[var(--color-bg-base)] py-8 px-4 md:px-12 flex flex-col items-center">
      
      {/* Top Header Navigation */}
      <div className="w-full max-w-[500px] flex items-center mb-6 px-1">
        <button onClick={() => navigate('/hub')} className="p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Top Header & Search */}
      <div className="w-full max-w-[500px] flex flex-col gap-6 mb-6 px-1">
        <div className="relative w-full">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)]" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[var(--color-surface)] text-body border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none shadow-card backdrop-blur-md placeholder:text-[var(--color-text-disabled)]"
          />
        </div>
      </div>

      {/* Sliding Filter Pills */}
      <div className="w-full max-w-[500px] flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none select-none px-1">
        {['all', 'pinned', 'ASL', 'ISL', 'Mic', 'Camera'].map((chip) => {
          const isActive = filterChip === chip.toLowerCase() || (chip === 'all' && filterChip === 'all')
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setFilterChip(chip.toLowerCase())}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
                isActive
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg-base)] border-[var(--color-accent)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50 backdrop-blur-md'
              }`}
            >
              {chip.charAt(0).toUpperCase() + chip.slice(1)}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="w-full max-w-[500px] flex flex-col gap-4 mt-2 px-1">
        {loading && (
          <div className="w-full flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-3 shadow-card h-32">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full flex flex-col gap-4">
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    layout
                    className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-elevated flex flex-col gap-4 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Preview
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="self-start text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[rgba(201,138,62,0.15)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                        Conversation
                      </span>
                      <p className="text-sm font-medium leading-relaxed text-[var(--color-text-primary)]">
                        {item.preview}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-[var(--color-border)]/50">
                      {/* Play Button */}
                      <button 
                        onClick={() => handleReplaySign(item)}
                        className="w-8 h-8 rounded-full bg-[rgba(201,138,62,0.15)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-base)] transition-colors"
                      >
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </button>
                      
                      {/* Pin Button */}
                      <button className="w-8 h-8 rounded-full bg-[rgba(201,138,62,0.15)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-base)] transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      
                      {/* Delete Button */}
                      <button className="w-8 h-8 rounded-full bg-[rgba(232,88,77,0.15)] text-[var(--color-error)] border border-[var(--color-error)]/30 flex items-center justify-center hover:bg-[var(--color-error)] hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}

                <div className="w-full flex justify-center mt-4">
                   <Button variant="ghost" className="w-full max-w-[200px] border border-[var(--color-border)] rounded-full">
                     Load More
                   </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-20 text-center border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-4 shadow-card px-6 backdrop-blur-md"
              >
                <div className="w-16 h-16 rounded-full bg-[rgba(201,138,62,0.15)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  <MessageSquare size={24} />
                </div>
                <div className="flex flex-col gap-2 max-w-md">
                  <h3 className="h3 font-display">No conversations</h3>
                  <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                    {search ? `No sessions matching "${search}".` : 'Your translated spoken phrases and gesture sessions will appear here.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </PageWrapper>
  )
}
