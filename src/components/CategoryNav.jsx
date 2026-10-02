import { CATEGORIES } from '../constants'

export default function CategoryNav({ value, onChange, counts, total }) {
  const items = [
    { key: 'all', label: 'ทุกหมวด', dot: 'var(--muted)', count: total },
    ...CATEGORIES.map((c) => ({ ...c, count: counts[c.key] })),
  ]

  return (
    <nav aria-label="หมวดหมู่" className="card p-2 md:sticky md:top-4">
      <p className="hidden md:block muted text-xs px-3 pt-1 pb-2 m-0">หมวดหมู่</p>
      <ul className="list-none m-0 p-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {items.map((c) => (
          <li key={c.key} className="flex-none md:flex-auto">
            <button className={'cat' + (value === c.key ? ' on' : '')} onClick={() => onChange(c.key)} aria-pressed={value === c.key}>
              <span className="dot" style={{ background: c.dot }} />
              {c.label}
              <span className="count">{c.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
