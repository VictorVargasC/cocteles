import { Link, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Illustration } from '../components/Illustration'
import {
  EmptyState,
  FavButton,
  FlavorBars,
  ProportionBar,
  StarRating,
  amountText,
} from '../components/parts'
import { COCKTAIL_MAP } from '../data/cocktails'
import { INGREDIENT_MAP } from '../data/ingredients'
import { proportions } from '../domain/proportions'
import { useStore } from '../store/useStore'

export function CocktailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const cocktail = COCKTAIL_MAP[id]
  const rating = useStore((s) => s.ratings[id] ?? 0)
  const tried = useStore((s) => s.history[id])
  const bar = useStore((s) => s.bar)
  const rate = useStore((s) => s.rate)
  const markTried = useStore((s) => s.markTried)

  const back = () => (window.history.length > 1 ? navigate(-1) : navigate('/'))

  if (!cocktail) {
    return (
      <>
        <header className="topbar">
          <button type="button" className="icon-btn" aria-label="Volver" onClick={back}>
            <Icon name="back" />
          </button>
        </header>
        <EmptyState title="No encontré ese cóctel" />
      </>
    )
  }

  return (
    <>
      <header className="topbar">
        <button type="button" className="icon-btn" aria-label="Volver" onClick={back}>
          <Icon name="back" />
        </button>
        <span style={{ flex: 1 }} />
        <FavButton id={cocktail.id} />
      </header>
      <main className="page">
        <div className="hero">
          <Illustration spec={cocktail.illustration} />
        </div>

        <h1 className="title">{cocktail.name}</h1>
        <p className="lead">{cocktail.intro}</p>
        <div className="tags">
          <span className="tag strong">{cocktail.category}</span>
          <span className="tag">Base: {cocktail.base}</span>
          <span className="tag">{cocktail.strength === 'Sin alcohol' ? 'Sin alcohol' : `Fuerza ${cocktail.strength.toLowerCase()}`}</span>
          <span className="tag">{cocktail.glass}</span>
          <span className="tag">{cocktail.method}</span>
        </div>

        <section className="section" aria-label="Tu calificación">
          <h2>Tu calificación</h2>
          <StarRating value={rating} onChange={(n) => rate(cocktail.id, n)} />
          <div className="actions">
            <button
              type="button"
              className={`btn grow${tried ? ' on' : ''}`}
              onClick={() => markTried(cocktail.id)}
              disabled={!!tried}
            >
              <Icon name="check" />
              {tried ? `Probado el ${new Date(tried.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Lo probé'}
            </button>
          </div>
        </section>

        <section className="section">
          <h2>Perfil de sabor</h2>
          <FlavorBars flavor={cocktail.flavor} />
        </section>

        <section className="section">
          <h2>Proporciones</h2>
          <ProportionBar portions={proportions(cocktail)} />
        </section>

        <section className="section">
          <h2>Ingredientes</h2>
          <div className="ing-list">
            {cocktail.ingredients.map((l) => {
              const ing = INGREDIENT_MAP[l.i]
              const have = bar.includes(l.i)
              return (
                <Link key={l.i} to={`/i/${l.i}`} className="ing-row">
                  <span>{ing.name}</span>
                  {have && (
                    <span className="opt" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                      en tu bar
                    </span>
                  )}
                  {l.opt && <span className="opt">opcional</span>}
                  <span className="amt">{amountText(l)}</span>
                </Link>
              )
            })}
          </div>
          <p className="muted small" style={{ marginTop: 10 }}>
            Guarnición: {cocktail.garnish}
          </p>
        </section>

        <section className="section">
          <h2>Preparación</h2>
          <ol className="steps">
            {cocktail.steps.map((s, i) => (
              <li key={i}>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  )
}
