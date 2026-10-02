import { useRef, useState } from 'react'
import { ClipboardList, Plus, Search, Trash2, X } from 'lucide-react'
import TodoItem from './components/TodoItem'
import Stats from './components/Stats'
import CategoryNav from './components/CategoryNav'
import { CATEGORIES, FILTERS, PRIORITIES, nextCategory, nextPriority } from './constants'
import { addDays, todayStr } from './utils/date'

const INITIAL_TODOS = [
  { id: 1, text: 'ส่งรายงานประจำสัปดาห์', done: false, priority: 'high', category: 'work', due: addDays(-1) },
  { id: 2, text: 'ซื้อของเข้าบ้าน', done: false, priority: 'medium', category: 'shopping', due: addDays(0) },
  { id: 3, text: 'โทรหาคุณแม่', done: true, priority: 'low', category: 'personal', due: addDays(-2) },
  { id: 4, text: 'นัดตรวจสุขภาพประจำปี', done: false, priority: 'medium', category: 'health', due: addDays(3) },
  { id: 5, text: 'เตรียมสไลด์ประชุมทีม', done: false, priority: 'high', category: 'work', due: addDays(1) },
]

const EXIT_MS = 280

function Row({ label, children }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="muted text-sm w-full sm:w-24">{label}</span>
      {children}
    </div>
  )
}

export default function App() {
  const [todos, setTodos] = useState(INITIAL_TODOS)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('personal')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [query, setQuery] = useState('')
  const nextId = useRef(INITIAL_TODOS.length + 1)
  const today = todayStr()

  const add = () => {
    const t = text.trim()
    if (!t) return
    setTodos((l) => [{ id: nextId.current++, text: t, done: false, priority, category, due }, ...l])
    setText('')
    setDue('')
  }

  const patch = (id, changes) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  const toggle = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const edit = (id, value) => patch(id, { text: value })
  const cyclePriority = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, priority: nextPriority(t.priority) } : t)))
  const cycleCategory = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, category: nextCategory(t.category) } : t)))
  const setDueDate = (id, value) => patch(id, { due: value })

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
  const catCounts = Object.fromEntries(CATEGORIES.map((c) => [c.key, live.filter((t) => t.category === c.key).length]))

  const q = query.trim().toLowerCase()
  const visible = todos.filter(
    (t) =>
      (filter === 'all' || (filter === 'active' ? !t.done : t.done)) &&
      (catFilter === 'all' || t.category === catFilter) &&
      (!q || t.text.toLowerCase().includes(q))
  )

  const emptyMessage = q
    ? `ไม่พบงานที่ตรงกับ “${query.trim()}”`
    : filter === 'done'
    ? 'ยังไม่มีงานที่เสร็จ'
    : filter === 'active'
    ? 'ไม่มีงานค้าง เยี่ยมมาก'
    : catFilter !== 'all'
    ? 'ยังไม่มีงานในหมวดนี้'
    : 'ยังไม่มีงาน พิมพ์ด้านบนเพื่อเพิ่มงานแรก'

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1">งานของฉัน</h1>
      <p className="muted text-sm mb-5">จดสิ่งที่ต้องทำ แล้วติ๊กเมื่อทำเสร็จ</p>

      <Stats todos={live} today={today} />

      <div className="grid gap-4 md:grid-cols-[200px_1fr]">
        <aside>
          <CategoryNav value={catFilter} onChange={setCatFilter} counts={catCounts} total={live.length} />
        </aside>

        <div className="min-w-0">
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

            <Row label="ความสำคัญ">
              {PRIORITIES.map((p) => (
                <button key={p.key} className={'seg' + (priority === p.key ? ' on' : '')} onClick={() => setPriority(p.key)} aria-pressed={priority === p.key}>
                  <span className="dot" style={{ background: p.dot }} />
                  {p.label}
                </button>
              ))}
            </Row>

            <Row label="หมวดหมู่">
              {CATEGORIES.map((c) => (
                <button key={c.key} className={'seg' + (category === c.key ? ' on' : '')} onClick={() => setCategory(c.key)} aria-pressed={category === c.key}>
                  <span className="dot" style={{ background: c.dot }} />
                  {c.label}
                </button>
              ))}
            </Row>

            <Row label="กำหนดส่ง">
              <input type="date" className="px-3 py-1.5 text-sm" value={due} onChange={(e) => setDue(e.target.value)} aria-label="กำหนดส่ง" />
            </Row>
          </section>

          <div className="relative mb-3">
            <Search size={16} className="muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-9 pr-9 py-2.5"
              placeholder="ค้นหางาน…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="ค้นหางาน"
            />
            {query && (
              <button className="icon-btn absolute right-1.5 top-1/2 -translate-y-1/2" onClick={() => setQuery('')} aria-label="ล้างคำค้นหา">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-1 mb-4 overflow-x-auto" role="tablist">
            {FILTERS.map((f) => (
              <button key={f.key} role="tab" aria-selected={filter === f.key} className={'tab' + (filter === f.key ? ' on' : '')} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="card flex flex-col items-center text-center py-10 px-4 muted">
              <ClipboardList size={32} />
              <p className="mt-3 text-sm">{emptyMessage}</p>
            </div>
          ) : (
            <ul className="list-none p-0 m-0">
              {visible.map((t) => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  today={today}
                  onToggle={toggle}
                  onDelete={remove}
                  onEdit={edit}
                  onPriority={cyclePriority}
                  onCategory={cycleCategory}
                  onDue={setDueDate}
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
        </div>
      </div>
    </main>
  )
}
