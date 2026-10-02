import { useRef, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { priorityLabel } from '../constants'

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onPriority }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const skipBlur = useRef(false)

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
      <div className="card flex items-center gap-3 px-3 py-3 sm:px-4">
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

        <button
          className={'badge p-' + todo.priority}
          onClick={() => onPriority(todo.id)}
          title="แตะเพื่อเปลี่ยนความสำคัญ"
        >
          {priorityLabel(todo.priority)}
        </button>

        <button className="icon-btn" onClick={() => onDelete(todo.id)} aria-label="ลบงาน">
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  )
}
