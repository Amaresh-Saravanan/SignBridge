import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Plus, X, Video, FileCode } from 'lucide-react'

import PageWrapper from '../../components/layout/PageWrapper'
import AdminMobileNotice from '../../components/admin/AdminMobileNotice'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import Dropdown from '../../components/ui/Dropdown'
import { useToastStore } from '../../stores/toastStore'
import { mockDictionary } from '../../data/mockData'

export default function Dictionary() {
  const navigate = useNavigate()
  const addToast = useToastStore((s) => s.addToast)

  // Local state
  const [dictionary, setDictionary] = useState(mockDictionary)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null) // selected dictionary word for side drawer editing
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Side Drawer form state
  const [formWord, setFormWord] = useState('')
  const [formSynonyms, setFormSynonyms] = useState('')
  const [formAnimation, setFormAnimation] = useState('')
  const [formStatus, setFormStatus] = useState('mapped')

  const openEditDrawer = (item) => {
    setSelectedItem(item)
    setIsAddingNew(false)
    setFormWord(item.word)
    setFormSynonyms(item.synonyms.join(', '))
    setFormAnimation(item.animationFile || '')
    setFormStatus(item.status)
  }

  const openAddDrawer = () => {
    setSelectedItem(null)
    setIsAddingNew(true)
    setFormWord('')
    setFormSynonyms('')
    setFormAnimation('')
    setFormStatus('missing')
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!formWord.trim()) {
      addToast({ type: 'error', message: 'Word is required.' })
      return
    }

    const synonymsArray = formSynonyms
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (isAddingNew) {
      const newItem = {
        id: Date.now(),
        word: formWord,
        synonyms: synonymsArray,
        animationFile: formAnimation || null,
        status: formStatus,
      }
      setDictionary([newItem, ...dictionary])
      addToast({ type: 'success', message: `Word "${formWord}" added to dictionary mapping.` })
      setIsAddingNew(false)
    } else if (selectedItem) {
      setDictionary(
        dictionary.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                word: formWord,
                synonyms: synonymsArray,
                animationFile: formAnimation || null,
                status: formStatus,
              }
            : item
        )
      )
      addToast({ type: 'success', message: `Word "${formWord}" updated.` })
      setSelectedItem(null)
    }
  }

  const handleDelete = (id) => {
    setDictionary(dictionary.filter((item) => item.id !== id))
    addToast({ type: 'success', message: 'Dictionary entry removed.' })
    setSelectedItem(null)
  }

  const filtered = dictionary.filter(
    (item) =>
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.synonyms.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg py-12 px-6 md:px-12">
      <AdminMobileNotice />

      <div className="max-w-[1280px] mx-auto flex flex-col items-start gap-8 relative">
        
        {/* Back link */}
        <button
          onClick={() => navigate('/hub')}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer outline-none group"
          aria-label="Go back to Hub"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Hub
        </button>

        {/* Dictionary Info & Actions */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="h1 font-display tracking-tight">ISL Dictionary Mapping</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Manage Indian Sign Language word keypoints and animations</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-disabled)]" />
              <input
                type="text"
                placeholder="Search words/synonyms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-60 pl-9 pr-4 py-2.5 rounded-[var(--radius-default)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] border border-[var(--color-border)] focus:border-[var(--color-accent-teal)] outline-none transition-all duration-200"
              />
            </div>
            <Button
              variant="primary"
              onClick={openAddDrawer}
              className="!py-2.5 !px-4 !text-sm flex items-center gap-1.5"
            >
              <Plus size={16} />
              Add Word
            </Button>
          </div>
        </div>

        {/* Main Grid Viewport (Table Left / Drawer Right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Table Panel */}
          <div className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] overflow-hidden transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.15)] ${
            selectedItem || isAddingNew ? 'lg:col-span-8' : 'lg:col-span-12'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
                    <th className="p-4 text-xs font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">Word</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">Synonyms</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">Animation (.glb)</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">Status</th>
                    <th className="p-4 text-xs font-bold tracking-wider text-[var(--color-text-secondary)] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => openEditDrawer(item)}
                      className={`border-b border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer ${
                        selectedItem?.id === item.id ? 'bg-[rgba(63,214,192,0.04)]' : ''
                      }`}
                    >
                      <td className="p-4 font-semibold text-sm">{item.word}</td>
                      <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                        {item.synonyms.join(', ')}
                      </td>
                      <td className="p-4 text-xs font-mono text-[var(--color-text-disabled)]">
                        {item.animationFile ? (
                          <span className="flex items-center gap-1">
                            <FileCode size={12} className="text-[var(--color-accent-teal)]" />
                            {item.animationFile}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        <Badge variant={item.status === 'mapped' ? 'teal' : 'warning'}>
                          {item.status === 'mapped' ? 'Mapped' : 'Missing'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {item.status === 'missing' && (
                          <Button
                            variant="secondary"
                            onClick={() => navigate(`/admin/collector?word=${item.word}`)}
                            className="!py-1.5 !px-3 !text-xs flex items-center gap-1 ml-auto"
                          >
                            <Video size={12} />
                            Collect Gesture
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-sm text-[var(--color-text-secondary)]">
                        No dictionary entries match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side Drawer Panel (Edit or Create Word) */}
          <AnimatePresence>
            {(selectedItem || isAddingNew) && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="lg:col-span-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col gap-6"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <h3 className="text-base font-bold">
                    {isAddingNew ? 'Add Word Mapping' : 'Edit Mapping'}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedItem(null)
                      setIsAddingNew(false)
                    }}
                    className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <Input
                    id="form-word"
                    label="Word / Root Phrase"
                    value={formWord}
                    onChange={(e) => setFormWord(e.target.value)}
                    placeholder="e.g. Good afternoon"
                  />
                  <Input
                    id="form-synonyms"
                    label="Synonyms (comma-separated)"
                    value={formSynonyms}
                    onChange={(e) => setFormSynonyms(e.target.value)}
                    placeholder="e.g. Afternoon, G'day"
                  />
                  <Input
                    id="form-animation"
                    label="Animation Filename (.glb)"
                    value={formAnimation}
                    onChange={(e) => setFormAnimation(e.target.value)}
                    placeholder="e.g. goodafternoon.glb (optional)"
                  />
                  
                  <Dropdown
                    label="Mapping Status"
                    options={[
                      { value: 'mapped', label: 'Mapped' },
                      { value: 'missing', label: 'Missing' },
                    ]}
                    value={formStatus}
                    onChange={setFormStatus}
                  />

                  <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)] mt-2">
                    {!isAddingNew && selectedItem && (
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedItem.id)}
                        className="text-xs text-[var(--color-error)] hover:bg-[rgba(248,113,113,0.06)] px-3 py-2 rounded transition-all cursor-pointer"
                      >
                        Delete Entry
                      </button>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedItem(null)
                          setIsAddingNew(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </PageWrapper>
  )
}
