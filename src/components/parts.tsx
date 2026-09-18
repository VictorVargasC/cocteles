import { Link } from 'react-router-dom'
import { COCKTAIL_MAP } from '../data/cocktails'
import { INGREDIENT_MAP } from '../data/ingredients'
import type { Portion } from '../domain/proportions'
import { useStore } from '../store/useStore'
import { FLAVOR_KEYS, FLAVOR_LABELS, type Cocktail, type FlavorProfile, type RecipeLine } from '../types'
import { Icon, StarGlyph } from './Icon'
import { Illustration } from './Illustration'

export function StarRating({
  value,
  onChange,
  small,
}: {
  value: number
  onChange?: (n: number) => void
  small?: boolean
}) {
  return (
    <div className={`stars${small ? ' sm' : ''}`} role={onChange ? 'radiogroup' : undefined} aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'on' : ''}
          disabled={!onChange}
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
          aria-pressed={n === value}
          onClick={() => onChange?.(n)}
        >
          <StarGlyph />
        </button>
      ))}
    </div>
  )
}

export function FavButton({ id }: { id: string }) {
  const fav = useStore((s) => s.favorites.includes(id))
  const toggle = useStore((s) => s.toggleFavorite)
  return (
    <button
      type="button"
      className={`icon-btn${fav ? ' on' : ''}`}
      aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={fav}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
    >
      <Icon name="heart" />
    </button>
  )
}

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  const rating = useStore((s) => s.ratings[cocktail.id])
  return (
    <Link to={`/c/${cocktail.id}`} className="card">
      <div className="card-art">
        <Illustration spec={cocktail.illustration} />
      </div>
      <div className="card-fav">
        <FavButton id={cocktail.id} />
      </div>
      <div className="card-body">
        <div className="card-title">{cocktail.name}</div>
        <div className="card-meta">
          {cocktail.category} · {cocktail.base}
        </div>
        {rating ? (
          <div className="card-stars" aria-label={`Tu nota: ${rating} de 5`}>
            {'★'.repeat(rating)}
            <span style={{ color: 'var(--line)' }}>{'★'.repeat(5 - rating)}</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}

/** Fila compacta con miniatura; `right` para contenido a la derecha */
export function CocktailRow({
  cocktail,
  children,
  right,
}: {
  cocktail: Cocktail
  children?: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <Link to={`/c/${cocktail.id}`} className="list-item">
      <div className="thumb">
        <Illustration spec={cocktail.illustration} />
      </div>
      <div className="grow">
        <div className="card-title">{cocktail.name}</div>
        <div className="card-meta">
          {cocktail.category} · {cocktail.base}
        </div>
        {children}
      </div>
      {right}
    </Link>
  )
}

export function FlavorBars({ flavor }: { flavor: FlavorProfile }) {
  return (
    <div className="flavor">
      {FLAVOR_KEYS.map((k) => (
        <div className="flavor-row" key={k}>
          <span>{FLAVOR_LABELS[k]}</span>
          <div className="dots" role="img" aria-label={`${FLAVOR_LABELS[k]}: ${flavor[k]} de 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <i key={n} className={n <= flavor[k] ? 'on' : ''} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const PALETTE = ['#e8553d', '#f2a516', '#3aa6e0', '#7cc576', '#8a4a8f', '#d69a45', '#e4577a', '#5f6b7a']

export function ProportionBar({ portions }: { portions: Portion[] }) {
  if (portions.length === 0) return null
  return (
    <div>
      <div className="prop-bar" role="img" aria-label="Proporciones de la receta">
        {portions.map((p, i) => (
          <span key={p.id} style={{ flex: p.pct, background: PALETTE[i % PALETTE.length] }} />
        ))}
      </div>
      <div className="prop-legend">
        {portions.map((p, i) => (
          <div key={p.id}>
            <i style={{ background: PALETTE[i % PALETTE.length] }} />
            <span>{INGREDIENT_MAP[p.id].name}</span>
            <b>
              {Math.round(p.pct)} % · {p.ml} ml
            </b>
          </div>
        ))}
      </div>
    </div>
  )
}

export function amountText(line: RecipeLine): string {
  return line.t ?? `${line.ml} ml`
}

export function cocktailById(id: string): Cocktail | undefined {
  return COCKTAIL_MAP[id]
}

export function EmptyState({
  title,
  hint,
  cocktail = 'margarita',
}: {
  title: string
  hint?: string
  cocktail?: string
}) {
  const c = COCKTAIL_MAP[cocktail]
  return (
    <div className="empty">
      <Illustration spec={c.illustration} />
      <p style={{ color: 'var(--ink)', fontWeight: 600 }}>{title}</p>
      {hint && <p className="small" style={{ marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>{title}</h3>
          <button type="button" className="icon-btn" aria-label="Cerrar" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
