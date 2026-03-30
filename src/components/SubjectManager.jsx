import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, X, BookOpen } from 'lucide-react'
import SubjectCard from './SubjectCard'

export default function SubjectManager({
  subjects,
  onAddSubject,
  onRenameSubject,
  onDeleteSubject,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onSetExamDate,
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (trimmed) {
      onAddSubject(trimmed)
      setNewName('')
      setShowAdd(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') {
      setShowAdd(false)
      setNewName('')
    }
  }

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-7"
      >
        <div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-indigo-400 mb-1.5">
            Study Arsenal
          </p>
          <h2 className="font-display text-3xl font-bold text-white">
            Your Subjects
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Organize your plan. Execute every day.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setShowAdd(true)
            setNewName('')
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
          style={{
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.75))',
            border: '1px solid rgba(99,102,241,0.4)',
            boxShadow: '0 0 20px rgba(99,102,241,0.22)',
          }}
        >
          <Plus size={15} />
          New Subject
        </motion.button>
      </motion.div>

      {/* Add subject panel */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="mb-5 flex items-center gap-3 p-4 glass rounded-2xl"
            style={{ border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <BookOpen size={18} className="text-indigo-400 flex-shrink-0" />
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Subject name (e.g. Biology, Mathematics, Physics)..."
              className="flex-1 bg-transparent font-display font-semibold text-lg text-white outline-none placeholder:text-slate-700"
            />
            <button
              onClick={handleAdd}
              className="px-5 py-2 rounded-xl font-semibold text-sm text-white whitespace-nowrap transition-colors"
              style={{
                background: 'rgba(99,102,241,0.4)',
                border: '1px solid rgba(99,102,241,0.5)',
              }}
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowAdd(false)
                setNewName('')
              }}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {subjects.length === 0 && !showAdd ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center py-24 glass rounded-3xl relative overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.04), transparent)',
            }}
          />
          <div className="relative z-10">
            <div className="text-5xl mb-5 opacity-20 select-none">📚</div>
            <p className="text-slate-400 font-display font-semibold text-lg mb-1">
              No subjects yet.
            </p>
            <p className="text-slate-600 text-sm mb-7">
              Add your first subject and start building your study plan.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
              style={{
                background:
                  'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.55))',
                border: '1px solid rgba(99,102,241,0.35)',
              }}
            >
              <Plus size={15} />
              Add your first subject
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {subjects.map((subject, i) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                index={i}
                onRename={onRenameSubject}
                onDelete={onDeleteSubject}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onToggleTask={onToggleTask}
                onSetExamDate={onSetExamDate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
