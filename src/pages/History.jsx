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
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg py-16 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto flex flex-col items-start gap-8 w-full">
        <button
          type="button"
          onClick={() => navigate('/hub')}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer outline-none group"
          aria-label="Go back to Hub"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Hub
        </button>

        {/* Tab row: left-aligned, active underline */}
        <div className="flex border-b border-[var(--color-border)] w-full gap-8 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-semibold relative transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            All conversations
            {activeTab === 'all' && (
              <motion.div
                layoutId="activeHistoryTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-sm font-semibold relative transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Saved phrases
            {activeTab === 'saved' && (
              <motion.div
                layoutId="activeHistoryTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
              />
            )}
          </button>
        </div>

        {/* Title, description, and Search Bar */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="h2 font-display">History &amp; phrasebook</h1>
            <p className="text-body text-[var(--color-text-secondary)]">Review and replay your past translated sentences</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)]" />
            <input
              type="text"
              placeholder="Search by keyword or date…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] text-body border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none min-h-[48px] shadow-sm"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
          {['all', 'everyday', 'medical'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setFilterChip(chip)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer whitespace-nowrap min-h-[32px] ${
                filterChip === chip
                  ? 'bg-[var(--color-accent-soft)] border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]'
              }`}
            >
              {chip.charAt(0).toUpperCase() + chip.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="w-full flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col gap-3 shadow-card">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="w-full bg-[var(--color-error-tint)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-8 text-center flex flex-col items-center gap-3">
            <AlertCircle size={40} className="text-[var(--color-error)]" />
            <h3 className="h3 font-display">Could not load history</h3>
            <p className="text-body text-[var(--color-text-secondary)]">{error}</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
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
                    className="p-5 md:p-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[var(--color-accent)]/20 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Left icon using handshape waveform motif settled state */}
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center text-[var(--color-accent)] shrink-0 mt-1 border border-[var(--color-accent)]/10">
                        <WaveformMotif state="active" size={18} />
                      </div>

                      <div className="flex flex-col items-start gap-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] font-mono">
                          <Calendar size={12} className="text-[var(--color-text-disabled)]" />
                          <span>
                            {new Date(item.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-base font-semibold leading-relaxed text-[var(--color-text-primary)]">{item.preview}</p>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      loading={replayingId === item.id}
                      onClick={() => handleReplaySign(item)}
                      className="!py-2 !px-4 !text-sm flex items-center gap-2 shrink-0 group min-h-[40px] rounded-[var(--radius-sm)]"
                    >
                      <Play size={12} fill="currentColor" className="transition-transform group-hover:scale-110" />
                      Replay translation
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-20 text-center border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-4 shadow-card px-6"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-accent)]/10">
                  <MessageSquare size={24} />
                </div>
                <div className="flex flex-col gap-2 max-w-md">
                  <h3 className="h3 font-display">No conversations found</h3>
                  <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                    {search
                      ? `We couldn't find any sessions matching "${search}". Try checking your spelling.`
                      : 'This page stores your translated spoken phrases and gesture sessions so you can quickly review and replay animations with the 3D avatar.'}
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
