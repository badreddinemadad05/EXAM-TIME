import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { footerQuotes } from '../data/motivational'
import { Target, Flame, Zap } from 'lucide-react'

function RotatingQuote({ quote }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.55 }}
      className="text-slate-500 text-base italic max-w-md mx-auto leading-relaxed"
    >
      "{quote}"
    </motion.p>
  )
}

export default function Footer({ examDate }) {
  const [quoteIndex, setQuoteIndex] = useState(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    return dayOfYear % footerQuotes.length
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % footerQuotes.length)
    }, 9000)
    return () => clearInterval(interval)
  }, [])

  const daysLeft = (() => {
    const parts = examDate.split('-').map(Number)
    if (parts.length !== 3 || parts.some(isNaN)) return 0
    const [year, month, day] = parts
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const exam = new Date(year, month - 1, day)
    return Math.max(0, Math.round((exam - today) / 86400000))
  })()

  const formattedExamDate = (() => {
    const parts = examDate.split('-').map(Number)
    if (parts.length !== 3 || parts.some(isNaN)) return examDate
    const [year, month, day] = parts
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  })()

  return (
    <footer className="px-4 pt-8 pb-16 max-w-6xl mx-auto">
      {/* Divider */}
      <div
        className="w-full h-px mb-14"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(99,102,241,0.25), rgba(139,92,246,0.25), transparent)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Rotating quote */}
        <div className="h-12 flex items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            <RotatingQuote key={quoteIndex} quote={footerQuotes[quoteIndex]} />
          </AnimatePresence>
        </div>

        {/* Quote dots indicator */}
        <div className="flex justify-center gap-1.5 mb-10">
          {footerQuotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setQuoteIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === quoteIndex ? 16 : 4,
                height: 4,
                background:
                  i === quoteIndex
                    ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>

        {/* Exam countdown pill */}
        <motion.div
          className="inline-flex items-center gap-3 glass px-6 py-3.5 rounded-2xl mb-8"
          style={{ border: '1px solid rgba(99,102,241,0.2)' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Zap size={15} className="text-indigo-400" />
          <span className="text-slate-300 text-sm font-medium">
            <span className="text-white font-bold">{daysLeft} days</span> until
            your exam — {formattedExamDate}
          </span>
          <Flame size={15} className="text-orange-400" />
        </motion.div>

        {/* Bottom label */}
        <p className="text-slate-700 text-xs tracking-[0.2em] uppercase mt-4">
          Study Command Center · Stay Locked In · Every Day Counts
        </p>
      </motion.div>
    </footer>
  )
}
