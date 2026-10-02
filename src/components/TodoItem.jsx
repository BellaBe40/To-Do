import { useRef, useState } from 'react'
import { Calendar, Check, Trash2 } from 'lucide-react'
import { categoryOf, priorityLabel } from '../constants'
import { dueStatus, formatDue } from '../utils/date'

function DueBadge({ todo, today, onChange }) {
  const ref = useRef(null)
  const status = dueStatus(todo, today)

  const open = () => {
    try {
      ref.current.showPicker()
    } catch {
      ref.current.focus()
    }
  }

  const label =
    status === 'none'
      ? 'ตั้งกำหนดส่ง'
      : status === 'today'
      ? 'วันนี้'
      : status === 'over'
      ? `เลยกำหนด · ${formatDue(todo.due)}`
      : formatDue(todo.due)

  return (
    <span className="relative inline-flex">
      <button className={'badge due-' + status} onClick={open} title="แตะเพื่อเปลี่ยนกำหนดส่ง">
        <Calendar size={12} />
        {label}
      </button>
      <input
        ref={ref}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={todo.due || ''}
        onChange={(e) => onChange(todo.id, e.target.value)}
        className="absolute left-0 bottom-0 w-full h-px opacity-0 pointer-events-none"
      />
    </span>
  )
}

export default function TodoItem({ todo, today, onToggle, onDelete, onEdit, onPriority, onCategory, onDue }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const skipBlur = useRef(false)
  const cat = categoryOf(todo.category)

  const save = () => {
    const t = draft.trim()
    if (t) onEdit(todo.id, t)
    else setDraft(todo.text)
    setEditing(false)
  }

  const cancel = () => {
    skipBlur.current = true
    setDraft(todo.text)
    setEditing(false)
  }

  return (
    <li className={'item' + (todo.leaving ? ' leaving' : '')}>
      <div className="card px-3 py-3 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            className={'chk' + (todo.done ? ' on' : '')}
            onClick={() => onToggle(todo.id)}
            aria-label={todo.done ? 'ยกเลิกการทำเครื่องหมายเสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
            aria-pressed={todo.done}
          >
            {todo.done && <Check size={14} />}
          </button>

          {editing ? (
            <input
              type="text"
              autoFocus
              value={draft}
              className="flex-1 min-w-0 px-2 py-1"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') cancel()
              }}
              onBlur={() => {
                if (skipBlur.current) {
                  skipBlur.current = false
                  return
                }
                save()
              }}
            />
          ) : (
            <span
              className="flex-1 min-w-0 break-words select-none cursor-text"
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                color: todo.done ? 'var(--muted)' : 'var(--text)',
              }}
              title="ดับเบิลคลิกเพื่อแก้ไข"
              onDoubleClick={() => {
                setDraft(todo.text)
                setEditing(true)
              }}
            >
              {todo.text}
            </span>
          )}

          <button className="icon-btn" onClick={() => onDelete(todo.id)} aria-label="ลบงาน">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2" style={{ paddingLeft: 34 }}>
          <button className={'badge p-' + todo.priority} onClick={() => onPriority(todo.id)} title="แตะเพื่อเปลี่ยนความสำคัญ">
            {priorityLabel(todo.priority)}
          </button>
          <button className="tag" onClick={() => onCategory(todo.id)} title="แตะเพื่อเปลี่ยนหมวดหมู่">
            <span className="dot" style={{ background: cat.dot }} />
            {cat.label}
          </button>
          <DueBadge todo={todo} today={today} onChange={onDue} />
        </div>
      </div>
    </li>
  )
}
