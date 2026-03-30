import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  CalendarPlus,
  Check,
  AlertTriangle,
} from 'lucide-react'
import TaskItem from './TaskItem'

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#22d3ee',
  '#f59e0b',
  '#ec4899',
  '#10b981',
  '#f97316',
  '#06b6d4',
]

// Returns the number of days from today to dateStr (negative = past)
function getDaysUntil(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null
  const [year, month, day] = parts
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(year, month - 1, day)
  return Math.round((target - today) / 86400000)
}

// 'YYYY-MM-DD' → 'June 1, 2026'
function formatDate(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr
  const [year, month, day] = parts
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function DaysBadge({ days }) {
  if (days === null) return null

  let label, bg, border, textColor

  if (days < 0) {
    label = 'Passed'
    bg = 'rgba(100,116,139,0.12)'
    border = 'rgba(100,116,139,0.25)'
    textColor = '#64748b'
  } else if (days === 0) {
    label = 'TODAY'
    bg = 'rgba(239,68,68,0.15)'
    border = 'rgba(239,68,68,0.4)'
    textColor = '#f87171'
  } else if (days <= 7) {
    label = `${days}d left`
    bg = 'rgba(239,68,68,0.12)'
    border = 'rgba(239,68,68,0.3)'
    textColor = '#f87171'
  } else if (days <= 15) {
    label = `${days}d left`
    bg = 'rgba(249,115,22,0.12)'
    border = 'rgba(249,115,22,0.3)'
    textColor = '#fb923c'
  } else if (days <= 30) {
    label = `${days}d left`
    bg = 'rgba(245,158,11,0.12)'
    border = 'rgba(245,158,11,0.3)'
    textColor = '#fbbf24'
  } else {
    label = `${days}d left`
    bg = 'rgba(99,102,241,0.1)'
    border = 'rgba(99,102,241,0.25)'
    textColor = '#a5b4fc'
  }

  return (
    <span
      className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
    >
      {label}
    </span>
  )
}

export default function SubjectCard({
  subject,
  index,
  onRename,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onSetExamDate,
}) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(subject.name)
  const [newTask, setNewTask] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [isEditingExamDate, setIsEditingExamDate] = useState(false)
  const [examDateInput, setExamDateInput] = useState(subject.examDate || '')

  const color = COLORS[index % COLORS.length]
  const completed = subject.tasks.filter((t) => t.completed).length
  const total = subject.tasks.length
  const progress = total > 0 ? (completed / total) * 100 : 0
  const daysUntil = getDaysUntil(subject.examDate)

  // ── Name handlers ──────────────────────────────────────────────────────────
  const handleSaveName = () => {
    const trimmed = nameValue.trim()
    if (trimmed) { onRename(subject.id, trimmed); setIsEditingName(false) }
  }
  const handleCancelName = () => {
    setIsEditingName(false)
    setNameValue(subject.name)
  }

  // ── Exam date handlers ─────────────────────────────────────────────────────
  const handleSaveExamDate = (overrideValue) => {
    const val = overrideValue !== undefined ? overrideValue : examDateInput
    onSetExamDate(subject.id, val || null)
    setIsEditingExamDate(false)
  }
  const handleCancelExamDate = () => {
    setExamDateInput(subject.examDate || '')
    setIsEditingExamDate(false)
  }
  const handleRemoveExamDate = () => {
    setExamDateInput('')
    handleSaveExamDate('')
  }

  // ── Task handlers ──────────────────────────────────────────────────────────
  const handleAddTask = () => {
    const trimmed = newTask.trim()
    if (trimmed) { onAddTask(subject.id, trimmed); setNewTask('') }
  }
  const handleTaskKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTask()
    if (e.key === 'Escape') { setShowAddTask(false); setNewTask('') }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        boxShadow: `0 20px 50px rgba(0,0,0,0.35), 0 0 30px ${color}12`,
        y: -2,
        transition: { duration: 0.2 },
      }}
      className="glass rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Colored top accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}44, transparent)` }}
      />

      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: color, boxShadow: `0 0 10px ${color}80` }}
        />
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName()
                if (e.key === 'Escape') handleCancelName()
              }}
              onBlur={handleSaveName}
              className="w-full bg-transparent font-display font-semibold text-lg text-white outline-none border-b pb-0.5"
              style={{ borderColor: `${color}60` }}
            />
          ) : (
            <h3 className="font-display font-semibold text-lg text-white truncate">
              {subject.name}
            </h3>
          )}
          <div className="text-xs text-slate-600 mt-0.5">
            {completed}/{total} task{total !== 1 ? 's' : ''} complete
          </div>
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          {isEditingName ? (
            <>
              <button onClick={handleSaveName} className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-emerald-500 transition-colors">
                <Save size={13} />
              </button>
              <button onClick={handleCancelName} className="p-1.5 rounded-lg hover:bg-slate-500/15 text-slate-600 transition-colors">
                <X size={13} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditingName(true)} className="p-1.5 rounded-lg hover:bg-indigo-500/15 text-slate-600 hover:text-indigo-400 transition-colors" title="Rename">
                <Pencil size={13} />
              </button>
              <button onClick={() => onDelete(subject.id)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-colors" title="Delete">
                <Trash2 size={13} />
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-600 transition-colors ml-1" title={isExpanded ? 'Collapse' : 'Expand'}>
                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}bb)`, boxShadow: `0 0 6px ${color}60` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Exam date row ───────────────────────────────────────────────────── */}
      <div className="px-5 pb-3">
        <AnimatePresence mode="wait">
          {isEditingExamDate ? (
            /* Edit mode */
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 py-1"
            >
              <Calendar size={12} className="text-slate-500 flex-shrink-0" />
              <input
                autoFocus
                type="date"
                value={examDateInput}
                onChange={(e) => setExamDateInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveExamDate()
                  if (e.key === 'Escape') handleCancelExamDate()
                }}
                className="premium-input rounded-lg px-2 py-0.5 text-xs flex-1 min-w-0"
                style={{ colorScheme: 'dark' }}
              />
              <button
                onClick={() => handleSaveExamDate()}
                className="p-1 rounded-md hover:bg-emerald-500/15 text-emerald-400 transition-colors flex-shrink-0"
                title="Save"
              >
                <Check size={12} />
              </button>
              {subject.examDate && (
                <button
                  onClick={handleRemoveExamDate}
                  className="p-1 rounded-md hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                  title="Remove date"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <button
                onClick={handleCancelExamDate}
                className="p-1 rounded-md hover:bg-slate-500/15 text-slate-600 transition-colors flex-shrink-0"
                title="Cancel"
              >
                <X size={12} />
              </button>
            </motion.div>
          ) : subject.examDate ? (
            /* Display mode — date is set */
            <motion.button
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setExamDateInput(subject.examDate)
                setIsEditingExamDate(true)
              }}
              className="group/date flex items-center gap-2 w-full py-1 rounded-lg transition-colors hover:bg-white/[0.02]"
              title="Click to change exam date"
            >
              <Calendar size={12} className="text-slate-600 group-hover/date:text-indigo-400 transition-colors flex-shrink-0" />
              <span className="text-xs text-slate-500 group-hover/date:text-slate-400 transition-colors truncate">
                {formatDate(subject.examDate)}
              </span>
              <DaysBadge days={daysUntil} />
              {daysUntil !== null && daysUntil <= 7 && daysUntil >= 0 && (
                <AlertTriangle size={11} className="text-red-400 flex-shrink-0 animate-pulse" />
              )}
              <Pencil size={9} className="text-slate-700 group-hover/date:text-indigo-400 transition-colors ml-auto flex-shrink-0" />
            </motion.button>
          ) : (
            /* No date set */
            <motion.button
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setExamDateInput('')
                setIsEditingExamDate(true)
              }}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-500 transition-colors py-1"
            >
              <CalendarPlus size={12} />
              Set exam date
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Divider before tasks */}
      <div className="mx-5 mb-0" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />

      {/* Expandable task list */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-2 space-y-0.5">
              <AnimatePresence>
                {subject.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={(id) => onToggleTask(subject.id, id)}
                    onEdit={(id, title) => onEditTask(subject.id, id, title)}
                    onDelete={(id) => onDeleteTask(subject.id, id)}
                  />
                ))}
              </AnimatePresence>

              {subject.tasks.length === 0 && !showAddTask && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-700 text-xs py-4 px-3"
                >
                  No tasks yet — add your first one below.
                </motion.p>
              )}

              <AnimatePresence>
                {showAddTask ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 mt-2"
                  >
                    <input
                      autoFocus
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={handleTaskKeyDown}
                      placeholder="Task description..."
                      className="flex-1 text-sm px-3 py-2 rounded-xl premium-input"
                    />
                    <button
                      onClick={handleAddTask}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors whitespace-nowrap"
                      style={{ background: `${color}30`, border: `1px solid ${color}50` }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setShowAddTask(false); setNewTask('') }}
                      className="p-2 rounded-xl hover:bg-white/5 text-slate-600 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowAddTask(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-400 transition-colors mt-2 py-2 px-3 rounded-xl hover:bg-indigo-500/8 w-full"
                  >
                    <Plus size={13} />
                    Add task
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
