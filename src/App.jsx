import { useState, useCallback, useRef } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { successMessages } from './data/motivational'
import Background from './components/Background'
import Hero from './components/Hero'
import StatsCards from './components/StatsCards'
import MissionSection from './components/MissionSection'
import SubjectManager from './components/SubjectManager'
import ProgressSection from './components/ProgressSection'
import SuccessToast from './components/SuccessToast'
import Footer from './components/Footer'

// Generate a unique numeric ID — safe across sessions
const makeId = () => Date.now() + Math.floor(Math.random() * 10000)

const randomMessage = () =>
  successMessages[Math.floor(Math.random() * successMessages.length)]

export default function App() {
  const [subjects, setSubjects] = useLocalStorage('scc_subjects_v1', [])
  const [examDate, setExamDate] = useLocalStorage('scc_exam_date', '2026-06-01')
  const [toast, setToast] = useState({ show: false, message: '' })
  const toastTimer = useRef(null)

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ show: true, message })
    toastTimer.current = setTimeout(
      () => setToast({ show: false, message: '' }),
      3200
    )
  }

  // ── Subject CRUD ──────────────────────────────────────────────────────────

  const addSubject = useCallback(
    (name) => {
      setSubjects((prev) => [
        ...prev,
        { id: makeId(), name, tasks: [] },
      ])
    },
    [setSubjects]
  )

  const renameSubject = useCallback(
    (subjectId, name) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === subjectId ? { ...s, name } : s))
      )
    },
    [setSubjects]
  )

  const deleteSubject = useCallback(
    (subjectId) => {
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId))
    },
    [setSubjects]
  )

  // ── Task CRUD ─────────────────────────────────────────────────────────────

  const addTask = useCallback(
    (subjectId, title) => {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId
            ? {
                ...s,
                tasks: [
                  ...s.tasks,
                  { id: makeId(), title, completed: false },
                ],
              }
            : s
        )
      )
    },
    [setSubjects]
  )

  const editTask = useCallback(
    (subjectId, taskId, title) => {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId
            ? {
                ...s,
                tasks: s.tasks.map((t) =>
                  t.id === taskId ? { ...t, title } : t
                ),
              }
            : s
        )
      )
    },
    [setSubjects]
  )

  const setSubjectExamDate = useCallback(
    (subjectId, date) => {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId ? { ...s, examDate: date || null } : s
        )
      )
    },
    [setSubjects]
  )

  const deleteTask = useCallback(
    (subjectId, taskId) => {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId
            ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }
            : s
        )
      )
    },
    [setSubjects]
  )

  const toggleTask = useCallback(
    (subjectId, taskId) => {
      let justCompleted = false

      // useLocalStorage calls the updater synchronously, so justCompleted
      // is set before we check it below.
      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id !== subjectId) return s
          return {
            ...s,
            tasks: s.tasks.map((t) => {
              if (t.id !== taskId) return t
              if (!t.completed) justCompleted = true // going incomplete → complete
              return { ...t, completed: !t.completed }
            }),
          }
        })
      )

      if (justCompleted) {
        showToast(randomMessage())
      }
    },
    [setSubjects]
  )

  return (
    <div className="min-h-screen relative">
      <Background />

      <main className="relative z-10">
        <Hero examDate={examDate} onDateChange={setExamDate} />
        <StatsCards subjects={subjects} />
        <MissionSection subjects={subjects} />
        <SubjectManager
          subjects={subjects}
          onAddSubject={addSubject}
          onRenameSubject={renameSubject}
          onDeleteSubject={deleteSubject}
          onAddTask={addTask}
          onEditTask={editTask}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onSetExamDate={setSubjectExamDate}
        />
        <ProgressSection subjects={subjects} />
        <Footer examDate={examDate} />
      </main>

      <SuccessToast
        notification={toast}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </div>
  )
}
