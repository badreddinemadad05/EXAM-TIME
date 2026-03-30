import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Check, Pencil, Trash2, X, Save } from 'lucide-react'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (trimmed) {
      onEdit(task.id, trimmed)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(task.title)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150"
      style={{ background: 'rgba(255,255,255,0.02)' }}
      whileHover={{ background: 'rgba(255,255,255,0.04)' }}
    >
      {/* Animated checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 w-[18px] h-[18px] rounded-md flex items-center justify-center transition-all duration-200"
        style={{
          border: task.completed
            ? '2px solid #10b981'
            : '2px solid rgba(99, 102, 241, 0.45)',
          background: task.completed ? '#10b981' : 'transparent',
          boxShadow: task.completed ? '0 0 12px rgba(16,185,129,0.45)' : 'none',
        }}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'backOut' }}
            >
              <Check size={10} className="text-white" strokeWidth={3.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full bg-transparent text-sm text-slate-200 outline-none border-b border-indigo-500/40 pb-0.5"
          />
        ) : (
          <span
            className="text-sm block truncate transition-all duration-300"
            style={{
              color: task.completed ? 'rgba(148,163,184,0.4)' : '#e2e8f0',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 rounded-lg hover:bg-emerald-500/15 text-emerald-500 transition-colors"
            >
              <Save size={12} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg hover:bg-slate-500/15 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-lg hover:bg-indigo-500/15 text-slate-600 hover:text-indigo-400 transition-colors"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-lg hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
