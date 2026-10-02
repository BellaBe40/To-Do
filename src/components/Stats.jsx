export default function Stats({ todos, today }) {
  const total = todos.length
  const done = todos.filter((t) => t.done).length
  const overdue = todos.filter((t) => !t.done && t.due && t.due < today).length
  const active = total - done - overdue
  const pct = total ? Math.round((done / total) * 100) : 0

  const segments = [
    { key: 'done', label: 'เสร็จแล้ว', value: done, color: 'var(--low-dot)' },
    { key: 'active', label: 'ยังไม่เสร็จ', value: active, color: 'var(--accent)' },
    { key: 'over', label: 'เลยกำหนด', value: overdue, color: 'var(--high-dot)' },
  ]

  // Donut: r = 100 / (2π) so the circumference is exactly 100 and dash lengths are percentages.
  let offset = 25 // start at 12 o'clock
  const arcs = segments.map((s) => {
    const len = total ? (s.value / total) * 100 : 0
    const arc = { ...s, len, offset }
    offset -= len
    return arc
  })

  return (
    <section className="card p-4 mb-4 flex flex-wrap items-center gap-x-6 gap-y-4" aria-label="สถิติ">
      <svg viewBox="0 0 42 42" width="88" height="88" role="img" aria-label={`เสร็จแล้ว ${pct}%`}>
        <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--border)" strokeWidth="5" />
        {arcs.map(
          (a) =>
            a.len > 0 && (
              <circle
                key={a.key}
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke={a.color}
                strokeWidth="5"
                strokeDasharray={`${a.len} ${100 - a.len}`}
                strokeDashoffset={a.offset}
              />
            )
        )}
        <text x="21" y="21" textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="600" fill="var(--text)">
          {pct}%
        </text>
      </svg>

      <div className="flex gap-6">
        <div>
          <div className="text-2xl font-semibold leading-none">{total}</div>
          <div className="muted text-sm mt-1">งานทั้งหมด</div>
        </div>
        <div>
          <div className="text-2xl font-semibold leading-none">{pct}%</div>
          <div className="muted text-sm mt-1">เสร็จแล้ว</div>
        </div>
      </div>

      <ul className="list-none m-0 p-0 grid gap-1 text-sm">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span className="dot" style={{ background: s.color }} />
            <span className="muted">{s.label}</span>
            <span className="font-medium">{s.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
