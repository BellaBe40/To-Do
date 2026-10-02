const pad = (n) => String(n).padStart(2, '0')

// Local-time YYYY-MM-DD (avoids the UTC shift of toISOString)
export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const todayStr = () => toDateStr(new Date())

export const addDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

export const formatDue = (str) =>
  new Date(str + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

// 'none' | 'over' | 'today' | 'normal'. Completed todos never show as overdue/today.
export function dueStatus(todo, today) {
  if (!todo.due) return 'none'
  if (todo.done) return 'normal'
  if (todo.due < today) return 'over'
  if (todo.due === today) return 'today'
  return 'normal'
}
