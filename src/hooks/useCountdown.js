import { useState, useEffect, useCallback } from 'react'

// targetDateStr format: 'YYYY-MM-DD'
export function useCountdown(targetDateStr) {
  const calculate = useCallback(() => {
    const parts = targetDateStr.split('-').map(Number)
    if (parts.length !== 3 || parts.some(isNaN)) {
      return { days: 0, weeks: 0, remainingDays: 0, isPast: true }
    }
    const [year, month, day] = parts

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(year, month - 1, day)

    const diff = target.getTime() - today.getTime()

    if (diff <= 0) return { days: 0, weeks: 0, remainingDays: 0, isPast: true }

    const days = Math.round(diff / (1000 * 60 * 60 * 24))
    return {
      days,
      weeks: Math.floor(days / 7),
      remainingDays: days % 7,
      isPast: false,
    }
  }, [targetDateStr])

  const [countdown, setCountdown] = useState(calculate)

  useEffect(() => {
    // Recalculate immediately when the target date changes
    setCountdown(calculate())

    // Also schedule an auto-refresh at midnight
    const scheduleUpdate = () => {
      const now = new Date()
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      return setTimeout(() => {
        setCountdown(calculate())
        scheduleUpdate()
      }, tomorrow.getTime() - now.getTime())
    }

    const timer = scheduleUpdate()
    return () => clearTimeout(timer)
  }, [calculate])

  return countdown
}
