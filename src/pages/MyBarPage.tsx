import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { CocktailRow, EmptyState } from '../components/parts'
import { COCKTAILS } from '../data/cocktails'
import { INGREDIENTS, INGREDIENT_CATEGORIES, INGREDIENT_MAP } from '../data/ingredients'
import { analyzeBar } from '../domain/mybar'
import { useStore } from '../store/useStore'

const STAPLE_IDS = INGREDIENTS.filter((i) => i.staple).map((i) => i.id)
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export function MyBarPage() {
  const bar = useStore((s) => s.bar)
  const allowSubs = useStore((s) => s.allowSubs)
  const setAllowSubs = useStore((s) => s.setAllowSubs)
  const toggleBar = useStore((s) => s.toggleBar)
  const clearBar = useStore((s) => s.clearBar)
  const [tab, setTab] = useState<'pick' | 'make'>('pick')
  const [q, setQ] = useState('')

  const result = useMemo(() => {
    if (bar.length === 0) return { ready: [], almost: [] }
    // los básicos (hielo, azúcar, agua, sal) se dan por tenidos
    return analyzeBar(COCKTAILS, new Set([...bar, ...STAPLE_IDS]), allowSubs)
  }, [bar, allowSubs])

  const query = norm(q)
  const groups = INGREDIENT_CATEGORIES.map((cat) => ({
    cat,
    items: INGREDIENTS.filter((i) => i.category === cat && !i.staple && (!query || norm(i.name).includes(query))),
  })).filter((g) => g.items.length > 0)

  const total = result.ready.length

  return (
    <>
      <header className="topbar">
        <h1>MiBar</h1>
        {bar.length > 0 && (
          <button type="button" className="chip" onClick={clearBar}>
            Vaciar
          </button>
        )}
      </header>
      <main className="page">
        <div className="segmented" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'pick'} className={tab === 'pick' ? 'on' : ''} onClick={() => setTab('pick')}>
            Mis ingredientes{bar.length ? ` (${bar.length})` : ''}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'make'} className={tab === 'make' ? 'on' : ''} onClick={() => setTab('make')}>
            Puedo preparar{bar.length ? ` (${total})` : ''}
          </button>
        </div>

        {tab === 'pick' ? (
          <>
            <p className="muted small" style={{ margin: '14px 0 10px' }}>
              Marca lo que tienes en casa. El hielo, el agua, el azúcar y la sal se dan por hechos.
            </p>
            <label className="search">
              <Icon name="search" />
              <input
                type="search"
                placeholder="Buscar ingrediente"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Buscar ingrediente"
              />
            </label>
            {groups.map((g) => (
              <section key={g.cat} className="section" style={{ marginTop: 20 }}>
                <h2>{g.cat}</h2>
                <div className="wrap">
                  {g.items.map((i) => {
                    const on = bar.includes(i.id)
                    return (
                      <button
                        key={i.id}
                        type="button"
                        className={`chip accent${on ? ' on' : ''}`}
                        aria-pressed={on}
                        onClick={() => toggleBar(i.id)}
                      >
                        {on && '✓ '}
                        {i.name}
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
            {groups.length === 0 && <p className="muted" style={{ marginTop: 20 }}>Ningún ingrediente coincide.</p>}
            {bar.length > 0 && (
              <div className="actions">
                <button type="button" className="btn primary grow" onClick={() => setTab('make')}>
                  Ver qué puedo preparar ({total})
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="switch-row">
              <div>
                <div style={{ fontWeight: 600 }}>Aceptar sustitutos</div>
                <div className="muted small">Cuenta un ingrediente parecido que ya tengas.</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={allowSubs}
                aria-label="Aceptar sustitutos"
                className={`switch${allowSubs ? ' on' : ''}`}
                onClick={() => setAllowSubs(!allowSubs)}
              />
            </div>

            {bar.length === 0 ? (
              <EmptyState
                title="Tu bar está vacío"
                hint="Marca los ingredientes que tienes y aquí verás qué cócteles puedes preparar."
                cocktail="old-fashioned"
              />
            ) : (
              <>
                <h2 className="sub-title">Puedes preparar ahora ({result.ready.length})</h2>
                {result.ready.length === 0 ? (
                  <p className="muted">Aún no te alcanza para uno completo. Mira los que te faltan un solo ingrediente.</p>
                ) : (
                  <div className="list">
                    {result.ready.map((m) => (
                      <CocktailRow key={m.cocktail.id} cocktail={m.cocktail}>
                        {m.substituted.length > 0 && (
                          <div className="reason">
                            {m.substituted
                              .map((s) => `${INGREDIENT_MAP[s.use].name} en vez de ${INGREDIENT_MAP[s.need].name.toLowerCase()}`)
                              .join(' · ')}
                          </div>
                        )}
                      </CocktailRow>
                    ))}
                  </div>
                )}

                <h2 className="sub-title">Te falta solo 1 ingrediente ({result.almost.length})</h2>
                <div className="list">
                  {result.almost.map((m) => {
                    const need = INGREDIENT_MAP[m.missing[0]]
                    const alt = need.substitutes.slice(0, 2).map((s) => INGREDIENT_MAP[s.id].name)
                    return (
                      <CocktailRow key={m.cocktail.id} cocktail={m.cocktail}>
                        <div className="missing">Falta: {need.name}</div>
                        {alt.length > 0 && <div className="reason">Podrías usar: {alt.join(' o ')}</div>}
                      </CocktailRow>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  )
}
