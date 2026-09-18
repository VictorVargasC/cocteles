import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { CocktailRow, EmptyState } from '../components/parts'
import { COCKTAILS } from '../data/cocktails'
import { INGREDIENT_MAP } from '../data/ingredients'
import { useStore } from '../store/useStore'

export function IngredientPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const ing = INGREDIENT_MAP[id]
  const have = useStore((s) => s.bar.includes(id))
  const toggleBar = useStore((s) => s.toggleBar)

  const usedIn = useMemo(
    () =>
      COCKTAILS.filter((c) => c.ingredients.some((l) => l.i === id)).sort((a, b) =>
        a.name.localeCompare(b.name, 'es'),
      ),
    [id],
  )

  const back = () => (window.history.length > 1 ? navigate(-1) : navigate('/'))

  if (!ing) {
    return (
      <>
        <header className="topbar">
          <button type="button" className="icon-btn" aria-label="Volver" onClick={back}>
            <Icon name="back" />
          </button>
        </header>
        <EmptyState title="No encontré ese ingrediente" />
      </>
    )
  }

  return (
    <>
      <header className="topbar">
        <button type="button" className="icon-btn" aria-label="Volver" onClick={back}>
          <Icon name="back" />
        </button>
      </header>
      <main className="page">
        <div className="tags" style={{ margin: 0 }}>
          <span className="tag strong">{ing.category}</span>
          {ing.staple && <span className="tag">Básico</span>}
        </div>
        <h1 className="title" style={{ marginTop: 10 }}>
          {ing.name}
        </h1>
        <p className="lead">{ing.description}</p>

        <div className="actions">
          <button
            type="button"
            className={`btn grow${have ? ' primary' : ''}`}
            onClick={() => toggleBar(ing.id)}
            aria-pressed={have}
          >
            <Icon name={have ? 'check' : 'plus'} />
            {have ? 'Lo tengo en MiBar' : 'Añadir a MiBar'}
          </button>
        </div>

        <section className="section">
          <h2>Sabor</h2>
          <div className="wrap">
            {ing.flavor.split(',').map((t) => (
              <span key={t} className="tag">
                {t.trim().charAt(0).toUpperCase() + t.trim().slice(1)}
              </span>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Puedes sustituirlo por</h2>
          {ing.substitutes.length === 0 ? (
            <p className="muted">No tiene un sustituto recomendable: es la esencia de los cócteles donde se usa.</p>
          ) : (
            <div className="list">
              {ing.substitutes.map((s) => (
                <Link key={s.id} to={`/i/${s.id}`} className="link-row">
                  <div style={{ flex: 1 }}>
                    <div className="card-title">{INGREDIENT_MAP[s.id].name}</div>
                    <div className="card-meta">{s.note}</div>
                  </div>
                  <span className="muted">
                    <Icon name="chevron" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <h2>Se usa en {usedIn.length} {usedIn.length === 1 ? 'cóctel' : 'cócteles'}</h2>
          <div className="list">
            {usedIn.map((c) => (
              <CocktailRow key={c.id} cocktail={c} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
