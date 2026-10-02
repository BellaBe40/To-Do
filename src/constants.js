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
