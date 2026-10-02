import { useRef, useState } from 'react'
import { ClipboardList, Plus, Trash2 } from 'lucide-react'
import TodoItem from './components/TodoItem'
import { FILTERS, PRIORITIES, nextPriority } from './constants'

const INITIAL_TODOS = [
  { id: 1, text: 'ส่งรายงานประจำสัปดาห์', done: false, priority: 'high' },
  { id: 2, text: 'ซื้อของเข้าบ้าน', done: false, priority: 'medium' },
  { id: 3, text: 'โทรหาคุณแม่', done: true, priority: 'low' },
]

const EXIT_MS = 280

export default function App() {
  const [todos, setTodos] = useState(INITIAL_TODOS)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const nextId = useRef(INITIAL_TODOS.length + 1)

  const add = () => {
    const t = text.trim()
    if (!t) return
    setTodos((l) => [{ id: nextId.current++, text: t, done: false, priority }, ...l])
    setText('')
  }

  const toggle = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const edit = (id, value) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, text: value } : t)))
  const cyclePriority = (id) =>
    setTodos((l) => l.map((t) => (t.id === id ? { ...t, priority: nextPriority(t.priority) } : t)))

  // Mark items as leaving so the CSS exit animation plays, then remove them.
  const removeIds = (ids) => {
    setTodos((l) => l.map((t) => (ids.includes(t.id) ? { ...t, leaving: true } : t)))
    setTimeout(() => setTodos((l) => l.filter((t) => !ids.includes(t.id))), EXIT_MS)
  }
  const remove = (id) => removeIds([id])
  const clearDone = () => removeIds(todos.filter((t) => t.done && !t.leaving).map((t) => t.id))

  const live = todos.filter((t) => !t.leaving)
  const remaining = live.filter((t) => !t.done).length
  const doneCount = live.length - remaining
  const visible = todos.filter((t) => filter === 'all' || (filter === 'active' ? !t.done : t.done))

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1">งานของฉัน</h1>
      <p className="muted text-sm mb-5">จดสิ่งที่ต้องทำ แล้วติ๊กเมื่อทำเสร็จ</p>

      <section className="card p-4 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 min-w-0 px-3 py-3"
            placeholder="เพิ่มงานใหม่…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            aria-label="ชื่องานใหม่"
          />
          <button className="btn" onClick={add} disabled={!text.trim()}>
            <Plus size={18} />
            <span className="hidden sm:inline">เพิ่ม</span>
            <span className="sr-only sm:hidden">เพิ่ม</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="muted text-sm mr-1">ความสำคัญ</span>
          {PRIORITIES.map((p) => (
            <button
              key={p.key}
              className={'seg' + (priority === p.key ? ' on' : '')}
              onClick={() => setPriority(p.key)}
              aria-pressed={priority === p.key}
            >
              <span className="dot" style={{ background: p.dot }} />
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex gap-1 mb-4" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            className={'tab' + (filter === f.key ? ' on' : '')}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card flex flex-col items-center text-center py-10 px-4 muted">
          <ClipboardList size={32} />
          <p className="mt-3 text-sm">
            {filter === 'done'
              ? 'ยังไม่มีงานที่เสร็จ'
              : filter === 'active'
              ? 'ไม่มีงานค้าง เยี่ยมมาก'
              : 'ยังไม่มีงาน พิมพ์ด้านบนเพื่อเพิ่มงานแรก'}
          </p>
        </div>
      ) : (
        <ul className="list-none p-0 m-0">
          {visible.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={toggle}
              onDelete={remove}
              onEdit={edit}
              onPriority={cyclePriority}
            />
          ))}
        </ul>
      )}

      <footer className="flex items-center justify-between mt-4 text-sm">
        <span className="muted">เหลือ {remaining} งาน</span>
        <button
          className="seg"
          onClick={clearDone}
          disabled={doneCount === 0}
          style={{ opacity: doneCount === 0 ? 0.5 : 1, cursor: doneCount === 0 ? 'not-allowed' : 'pointer' }}
        >
          <Trash2 size={14} />
          ล้างงานที่เสร็จแล้ว{doneCount > 0 ? ` (${doneCount})` : ''}
        </button>
      </footer>
    </main>
  )
}
