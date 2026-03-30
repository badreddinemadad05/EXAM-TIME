import { motion } from 'framer-motion'
import { CheckCircle2, Circle, BookOpen, TrendingUp } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: 'easeOut' }}
      whileHover={{
        y: -5,
        boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${color}18`,
        transition: { duration: 0.2 },
      }}
      className="glass rounded-2xl p-6 relative overflow-hidden cursor-default"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 left-0 w-40 h-40 opacity-[0.07] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="inline-flex p-2.5 rounded-xl mb-4"
          style={{
            background: `${color}14`,
            border: `1px solid ${color}22`,
          }}
        >
          <Icon size={17} style={{ color }} />
        </div>

        {/* Value */}
        <div
          className="text-4xl font-display font-bold mb-1 tabular-nums"
          style={{ color }}
        >
          {value}
        </div>

        {/* Label */}
        <div className="text-slate-300 font-medium text-sm">{label}</div>
        {sub && <div className="text-slate-600 text-xs mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  )
}

export default function StatsCards({ subjects }) {
  const totalTasks = subjects.reduce((acc, s) => acc + s.tasks.length, 0)
  const completedTasks = subjects.reduce(
    (acc, s) => acc + s.tasks.filter((t) => t.completed).length,
    0
  )
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const stats = [
    {
      icon: BookOpen,
      label: 'Subjects',
      value: subjects.length,
      sub: 'Active study areas',
      color: '#6366f1',
    },
    {
      icon: Circle,
      label: 'Total Tasks',
      value: totalTasks,
      sub: 'Across all subjects',
      color: '#8b5cf6',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completedTasks,
      sub: 'Tasks done',
      color: '#10b981',
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      value: `${percentage}%`,
      sub: 'Overall completion',
      color: '#22d3ee',
    },
  ]

  return (
    <section id="dashboard" className="px-4 pb-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} index={i} />
        ))}
      </div>
    </section>
  )
}
