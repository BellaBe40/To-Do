export const PRIORITIES = [
  { key: 'low', label: 'ต่ำ', dot: 'var(--low-dot)' },
  { key: 'medium', label: 'ปานกลาง', dot: 'var(--med-dot)' },
  { key: 'high', label: 'สูง', dot: 'var(--high-dot)' },
]

export const FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'active', label: 'ยังไม่เสร็จ' },
  { key: 'done', label: 'เสร็จแล้ว' },
]

export const priorityLabel = (key) => PRIORITIES.find((p) => p.key === key).label

export const nextPriority = (key) =>
  PRIORITIES[(PRIORITIES.findIndex((p) => p.key === key) + 1) % PRIORITIES.length].key

export const CATEGORIES = [
  { key: 'work', label: 'งาน', dot: 'var(--cat-work)' },
  { key: 'personal', label: 'ส่วนตัว', dot: 'var(--cat-personal)' },
  { key: 'shopping', label: 'ช้อปปิ้ง', dot: 'var(--cat-shopping)' },
  { key: 'health', label: 'สุขภาพ', dot: 'var(--cat-health)' },
]

export const categoryOf = (key) => CATEGORIES.find((c) => c.key === key)

export const nextCategory = (key) =>
  CATEGORIES[(CATEGORIES.findIndex((c) => c.key === key) + 1) % CATEGORIES.length].key
