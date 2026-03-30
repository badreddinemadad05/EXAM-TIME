import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { heroQuotes } from '../data/motivational'
import { Calendar, Target, ChevronDown, Pencil, Check, X } from 'lucide-react'

function CounterDigit({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block tabular-nums"
    >
      {value}
    </motion.span>
  )
}

// 'YYYY-MM-DD' → 'June 1, 2026'
function formatDate(dateStr) {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr
  const [year, month, day] = parts
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Hero({ examDate, onDateChange }) {
  const { days, weeks, remainingDays, isPast } = useCountdown(examDate)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [dateInput, setDateInput] = useState(examDate)

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    setQuoteIndex(dayOfYear % heroQuotes.length)
  }, [])

  // Keep input in sync if parent changes it from elsewhere
  useEffect(() => {
    setDateInput(examDate)
  }, [examDate])

  const handleSaveDate = () => {
    if (dateInput && dateInput !== examDate) {
      onDateChange(dateInput)
    }
    setIsEditingDate(false)
  }

  const handleCancelEdit = () => {
    setDateInput(examDate)
    setIsEditingDate(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveDate()
    if (e.key === 'Escape') handleCancelEdit()
  }

  const quote = heroQuotes[quoteIndex]
  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const displayDays = isPast ? 0 : days

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      {/* Central radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-7"
          style={{ border: '1px solid rgba(99,102,241,0.28)' }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-300">
            Study Command Center
          </span>
        </motion.div>

        {/* Today's date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-14"
        >
          <Calendar size={13} className="text-indigo-500" />
          <span>{dateString}</span>
        </motion.div>

        {/* Main countdown ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-flex items-center justify-center mb-12"
        >
          <div
            className="absolute rounded-full animated-border"
            style={{
              width: 300,
              height: 300,
              border: '1px solid rgba(99,102,241,0.3)',
              boxShadow:
                '0 0 60px rgba(99,102,241,0.12), inset 0 0 60px rgba(99,102,241,0.04)',
            }}
          />
          <div
            className="absolute rounded-full ring-pulse"
            style={{
              width: 270,
              height: 270,
              border: '1px solid rgba(99,102,241,0.14)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 238,
              height: 238,
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          />

          <div
            className="relative z-10 flex flex-col items-center justify-center"
            style={{ width: 228, height: 228 }}
          >
            <div
              className="font-display font-bold text-glow leading-none"
              style={{ fontSize: '5.5rem', color: '#f8fafc' }}
            >
              <CounterDigit value={displayDays} />
            </div>
            <div className="text-[0.65rem] font-bold tracking-[0.35em] uppercase text-indigo-400 mt-2">
              Days Left
            </div>
          </div>
        </motion.div>

        {/* Secondary info chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-14"
        >
          {/* Weeks chip */}
          <div
            className="glass px-5 py-2.5 rounded-xl flex items-center gap-2"
            style={{ border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <span className="text-2xl font-display font-bold text-violet-400">
              {isPast ? 0 : weeks}
            </span>
            <div className="text-left">
              <div className="text-[0.6rem] tracking-[0.2em] uppercase text-slate-600">
                Weeks
              </div>
              <div className="text-xs text-slate-500">remaining</div>
            </div>
          </div>

          {!isPast && remainingDays > 0 && (
            <div
              className="glass px-5 py-2.5 rounded-xl flex items-center gap-2"
              style={{ border: '1px solid rgba(34,211,238,0.18)' }}
            >
              <span className="text-2xl font-display font-bold text-cyan-400">
                +{remainingDays}
              </span>
              <div className="text-left">
                <div className="text-[0.6rem] tracking-[0.2em] uppercase text-slate-600">
                  Extra
                </div>
                <div className="text-xs text-slate-500">days</div>
              </div>
            </div>
          )}

          {/* ── Target date chip — click to edit ── */}
          <div
            className="glass px-5 py-2.5 rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <AnimatePresence mode="wait">
              {isEditingDate ? (
                /* Edit mode */
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <Target size={13} className="text-indigo-400 flex-shrink-0" />
                  <input
                    autoFocus
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="premium-input rounded-lg px-2 py-0.5 text-xs w-32"
                    style={{ colorScheme: 'dark' }}
                  />
                  <button
                    onClick={handleSaveDate}
                    className="p-1 rounded-md hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                    title="Save"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 rounded-md hover:bg-slate-500/15 text-slate-600 hover:text-slate-400 transition-colors"
                    title="Cancel"
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              ) : (
                /* Display mode — click anywhere to open editor */
                <motion.button
                  key="display"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setIsEditingDate(true)}
                  className="flex items-center gap-2 group/target"
                  title="Click to change target date"
                >
                  <Target size={15} className="text-slate-500 group-hover/target:text-indigo-400 transition-colors" />
                  <div className="text-left">
                    <div className="text-[0.6rem] tracking-[0.2em] uppercase text-slate-600">
                      Target
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-medium group-hover/target:text-slate-300 transition-colors">
                        {formatDate(examDate)}
                      </span>
                      <Pencil
                        size={9}
                        className="text-slate-700 group-hover/target:text-indigo-400 transition-colors"
                      />
                    </div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Motivational quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mb-4"
        >
          <h1
            className="font-display font-bold gradient-text mb-3"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            {quote.headline}
          </h1>
          <p
            className="text-slate-400 max-w-sm mx-auto leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}
          >
            {quote.sub}
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex flex-col items-center gap-2 text-slate-700 cursor-pointer"
            onClick={() =>
              document
                .getElementById('dashboard')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <div
              className="w-px h-10"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(99,102,241,0.5))',
              }}
            />
            <ChevronDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
