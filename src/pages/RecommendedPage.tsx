import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { CocktailRow, EmptyState, Sheet } from '../components/parts'
import { COCKTAILS, COCKTAIL_MAP } from '../data/cocktails'
import { recommend } from '../domain/recommend'
import { useStore } from '../store/useStore'

export function RecommendedPage() {
  const likes = useStore((s) => s.likes)
  const favorites = useStore((s) => s.favorites)
  const ratings = useStore((s) => s.ratings)
  const history = useStore((s) => s.history)
  const toggleLike = useStore((s) => s.toggleLike)
  const [hideTried, setHideTried] = useState(true)
  const [picker, setPicker] = useState(false)

  // Gustos: los que elegiste + favoritos + calificados con 4-5. Disgustos: calificados con 1-2.
  const { liked, disliked } = useMemo(() => {
    const likedIds = new Set<string>(likes)
    favorites.forEach((id) => likedIds.add(id))
    const dislikedIds = new Set<string>()
    for (const [id, n] of Object.entries(ratings)) {
      if (n >= 4) likedIds.add(id)
      else if (n <= 2) dislikedIds.add(id)
    }
    dislikedIds.forEach((id) => likedIds.delete(id))
    return {
      liked: [...likedIds].map((id) => COCKTAIL_MAP[id]).filter(Boolean),
      disliked: [...dislikedIds].map((id) => COCKTAIL_MAP[id]).filter(Boolean),
    }
  }, [likes, favorites, ratings])

  const recs = useMemo(
    () =>
      recommend(COCKTAILS, {
        likes: liked,
        dislikes: disliked,
        exclude: hideTried ? new Set(Object.keys(history)) : new Set(),
        limit: 15,
      }),
    [liked, disliked, hideTried, history],
  )

  const auto = liked.filter((c) => !likes.includes(c.id))

  return (
    <>
      <header className="topbar">
        <h1>Para ti</h1>
      </header>
      <main className="page">
        <section>
          <h2 className="sub-title" style={{ marginTop: 0 }}>Cócteles que te gustan</h2>
          <div className="wrap">
            {likes.map((id) => (
              <button key={id} type="button" className="chip on" onClick={() => toggleLike(id)} aria-label={`Quitar ${COCKTAIL_MAP[id].name}`}>
                {COCKTAIL_MAP[id].name} ✕
              </button>
            ))}
            <button type="button" className="chip" onClick={() => setPicker(true)}>
              + Agregar
            </button>
          </div>
          {auto.length > 0 && (
            <p className="muted small" style={{ marginTop: 10 }}>
              También cuento tus favoritos y los que calificaste con 4 o 5 estrellas: {auto.map((c) => c.name).join(', ')}.
            </p>
          )}
        </section>

        <div className="switch-row">
          <div style={{ fontWeight: 600 }}>Ocultar los que ya probé</div>
          <button
            type="button"
            role="switch"
            aria-checked={hideTried}
            aria-label="Ocultar los que ya probé"
            className={`switch${hideTried ? ' on' : ''}`}
            onClick={() => setHideTried(!hideTried)}
          />
        </div>

        {liked.length === 0 ? (
          <EmptyState title="Dime qué cócteles te gustan" hint="Con eso te sugiero qué pedir la próxima vez." cocktail="mojito" />
        ) : recs.length === 0 ? (
          <EmptyState title="No hay más sugerencias" hint="Desactiva “Ocultar los que ya probé” para ver más." cocktail="daiquiri" />
        ) : (
          <>
            <h2 className="sub-title">Te recomiendo pedir</h2>
            <div className="list">
              {recs.map((r) => (
                <CocktailRow
                  key={r.cocktail.id}
                  cocktail={r.cocktail}
                  right={<span className="score">{r.score}%</span>}
                >
                  <div className="reason" style={{ color: 'var(--ink)' }}>
                    Parecido a {r.because.map((b) => b.name).join(' y ')}
                  </div>
                  {r.reasons.length > 0 && <div className="reason">{r.reasons.join(' · ')}</div>}
                </CocktailRow>
              ))}
            </div>
          </>
        )}
      </main>
      {picker && <Picker onClose={() => setPicker(false)} />}
    </>
  )
}

function Picker({ onClose }: { onClose: () => void }) {
  const likes = useStore((s) => s.likes)
  const toggleLike = useStore((s) => s.toggleLike)
  const [q, setQ] = useState('')
  const items = COCKTAILS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase().trim())).sort((a, b) =>
    a.name.localeCompare(b.name, 'es'),
  )
  return (
    <Sheet title="¿Cuáles te gustan?" onClose={onClose}>
      <label className="search" style={{ marginTop: 12 }}>
        <Icon name="search" />
        <input type="search" placeholder="Buscar cóctel" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar cóctel" />
      </label>
      <div className="wrap" style={{ marginTop: 14 }}>
        {items.map((c) => {
          const on = likes.includes(c.id)
          return (
            <button key={c.id} type="button" className={`chip accent${on ? ' on' : ''}`} aria-pressed={on} onClick={() => toggleLike(c.id)}>
              {on && '✓ '}
              {c.name}
            </button>
          )
        })}
      </div>
      <div className="actions">
        <button type="button" className="btn primary grow" onClick={onClose}>
          Listo
        </button>
      </div>
    </Sheet>
  )
}
