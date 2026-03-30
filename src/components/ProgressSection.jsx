import { motion } from 'framer-motion'
import { BarChart3, Award, Trophy } from 'lucide-react'

const SUBJECT_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#22d3ee',
  '#f59e0b',
  '#ec4899',
  '#10b981',
  '#f97316',
  '#06b6d4',
]

function SubjectBar({ subject, index, colorIndex }) {
  const completed = subject.tasks.filter((t) => t.completed).length
  const total = subject.tasks.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const color = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="flex items-center gap-4"
    >
      <div
        className="text-sm text-slate-400 truncate text-right flex-shrink-0"
        style={{ width: 110 }}
      >
        {subject.name}
      </div>

      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            boxShadow: `0 0 8px ${color}50`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 + index * 0.07, ease: 'easeOut' }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            animate={{ x: ['-100%', '250%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 4,
              delay: index * 0.3,
            }}
          />
        </motion.div>
      </div>

      <div
        className="text-sm font-bold tabular-nums flex-shrink-0 text-right"
        style={{ color, width: 38 }}
      >
        {pct}%
      </div>
    </motion.div>
  )
}

export default function ProgressSection({ subjects }) {
  const totalTasks = subjects.reduce((acc, s) => acc + s.tasks.length, 0)
  const completedTasks = subjects.reduce(
    (acc, s) => acc + s.tasks.filter((t) => t.completed).length,
    0
  )
  const globalPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const subjectsWithTasks = subjects.filter((s) => s.tasks.length > 0)

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="glass rounded-3xl p-8 relative overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle at 100% 0%, #22d3ee, transparent 65%)',
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-xl"
              style={{
                background: 'rgba(34,211,238,0.1)',
                border: '1px solid rgba(34,211,238,0.2)',
              }}
            >
              <BarChart3 size={16} className="text-cyan-400" />
            </div>
            <span className="text-xs font-bold tracking-[0.22em] uppercase text-cyan-400">
              Analytics
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-8">
            Progress Report
          </h2>

          {/* Global progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-slate-500" />
                <span className="text-slate-300 font-medium text-sm">
                  Overall Mission Progress
                </span>
              </div>
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                {globalPct}%
              </span>
            </div>

            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
                  boxShadow: '0 0 16px rgba(99,102,241,0.4)',
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${globalPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '250%'] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 5,
                  }}
                />
              </motion.div>
            </div>

            <div className="flex justify-between text-xs text-slate-600 mt-2">
              <span>{completedTasks} completed</span>
              <span>{totalTasks - completedTasks} remaining</span>
            </div>
          </div>

          {/* Per-subject breakdown */}
          {subjectsWithTasks.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Award size={13} className="text-slate-600" />
                <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  Per Subject Breakdown
                </span>
              </div>
              <div className="space-y-4">
                {subjectsWithTasks.map((subject, i) => (
                  <SubjectBar
                    key={subject.id}
                    subject={subject}
                    index={i}
                    colorIndex={subjects.indexOf(subject)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-700 text-sm">
              Add subjects and tasks to see your per-subject breakdown.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  )
}
