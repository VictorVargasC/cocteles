import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Illustration } from '../components/Illustration'
import { EmptyState, StarRating } from '../components/parts'
import { COCKTAIL_MAP } from '../data/cocktails'
import { useStore } from '../store/useStore'

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })

export function HistoryPage() {
  const history = useStore((s) => s.history)
  const ratings = useStore((s) => s.ratings)
  const rate = useStore((s) => s.rate)
  const setNote = useStore((s) => s.setNote)
  const remove = useStore((s) => s.removeFromHistory)
  const [confirming, setConfirming] = useState<string | null>(null)

  const entries = Object.entries(history)
    .filter(([id]) => COCKTAIL_MAP[id])
    .sort(([, a], [, b]) => b.date.localeCompare(a.date))

  const rated = Object.values(ratings)
  const avg = rated.length ? (rated.reduce((s, n) => s + n, 0) / rated.length).toFixed(1) : null

  return (
    <>
      <header className="topbar">
        <h1>Historial</h1>
      </header>
      <main className="page">
        {entries.length === 0 ? (
          <EmptyState
            title="Todavía no has probado ninguno"
            hint="Califica un cóctel o toca “Lo probé” para llevar tu registro."
            cocktail="mai-tai"
          />
        ) : (
          <>
            <p className="count">
              {entries.length} {entries.length === 1 ? 'cóctel probado' : 'cócteles probados'}
              {avg && ` · nota media ${avg} ★`}
            </p>
            <div className="list">
              {entries.map(([id, entry]) => {
                const c = COCKTAIL_MAP[id]
                return (
                  <div key={id} className="list-item" style={{ alignItems: 'flex-start' }}>
                    <Link to={`/c/${id}`} className="thumb" aria-label={c.name}>
                      <Illustration spec={c.illustration} />
                    </Link>
                    <div className="grow">
                      <Link to={`/c/${id}`} className="card-title">
                        {c.name}
                      </Link>
                      <div className="card-meta">{fmt(entry.date)}</div>
                      <StarRating small value={ratings[id] ?? 0} onChange={(n) => rate(id, n)} />
                      <input
                        className="note-input"
                        placeholder="Añade una nota (ej. en Cancún, muy dulce)"
                        defaultValue={entry.note ?? ''}
                        onBlur={(e) => setNote(id, e.target.value.trim())}
                        aria-label={`Nota sobre ${c.name}`}
                      />
                    </div>
                    {confirming === id ? (
                      <div style={{ display: 'grid', gap: 6 }}>
                        <button type="button" className="btn danger" style={{ height: 36, padding: '0 12px' }} onClick={() => { remove(id); setConfirming(null) }}>
                          Quitar
                        </button>
                        <button type="button" className="btn" style={{ height: 36, padding: '0 12px' }} onClick={() => setConfirming(null)}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Quitar ${c.name} del historial`}
                        onClick={() => setConfirming(id)}
                      >
                        <Icon name="trash" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </>
  )
}
