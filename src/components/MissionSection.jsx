import { motion } from 'framer-motion'
import { Target, Zap, Crosshair } from 'lucide-react'

export default function MissionSection({ subjects }) {
  const allPending = subjects.flatMap((s) =>
    s.tasks
      .filter((t) => !t.completed)
      .map((t) => ({ ...t, subjectName: s.name }))
  )

  const displayed = allPending.slice(0, 5)
  const extra = allPending.length - displayed.length

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="glass rounded-3xl p-8 relative overflow-hidden"
        style={{ border: '1px solid rgba(99,102,241,0.18)' }}
      >
        {/* BG accent */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle at 100% 0%, #6366f1, transparent 65%)',
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.22)',
                  }}
                >
                  <Target size={16} className="text-indigo-400" />
                </div>
                <span className="text-xs font-bold tracking-[0.22em] uppercase text-indigo-400">
                  Mission Control
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                {dayName}'s Focus
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Priority targets — clear these today.
              </p>
            </div>

            <div
              className="glass px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Crosshair size={12} className="text-slate-500" />
              <span className="text-xs text-slate-500 font-medium">
                {allPending.length} pending
              </span>
            </div>
          </div>

          {/* Task list or empty state */}
          {allPending.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 py-5"
            >
              <div
                className="p-3 rounded-2xl flex-shrink-0"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                <Zap size={20} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-emerald-400 font-semibold font-display">
                  All clear. Mission complete.
                </div>
                <div className="text-slate-500 text-sm mt-0.5">
                  Add more tasks to keep the momentum going.
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {displayed.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#6366f1', boxShadow: '0 0 6px #6366f1' }}
                  />
                  <span className="text-slate-300 text-sm flex-1 truncate">
                    {task.title}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'rgba(148,163,184,0.7)',
                    }}
                  >
                    {task.subjectName}
                  </span>
                </motion.div>
              ))}

              {extra > 0 && (
                <p className="text-slate-600 text-xs pl-2 pt-1">
                  + {extra} more task{extra > 1 ? 's' : ''} pending
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
