import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { create } from 'zustand'
import { Icon } from '../components/Icon'
import { CocktailCard, EmptyState, Sheet } from '../components/parts'
import { COCKTAILS } from '../data/cocktails'
import { INGREDIENT_MAP } from '../data/ingredients'
import {
  FLAVOR_KEYS,
  FLAVOR_LABELS,
  type Base,
  type Category,
  type Cocktail,
  type FlavorKey,
  type Method,
  type Strength,
} from '../types'

const CATEGORIES: Category[] = ['Tropical', 'Refrescante', 'Frutal', 'Cremoso', 'Ácido', 'Amargo', 'Burbujeante', 'Fuerte']
const BASES: Base[] = ['Ron', 'Vodka', 'Tequila', 'Ginebra', 'Whisky', 'Brandy', 'Cachaça', 'Licor', 'Vino', 'Cerveza', 'Pisco', 'Sin alcohol']
const STRENGTHS: Strength[] = ['Sin alcohol', 'Suave', 'Media', 'Fuerte']
const METHODS: Method[] = ['Directo', 'Agitado', 'Revuelto', 'Licuado', 'Macerado', 'En capas']

interface Filters {
  query: string
  category: Category | null
  bases: Base[]
  strengths: Strength[]
  methods: Method[]
  flavors: FlavorKey[]
  set: (p: Partial<Omit<Filters, 'set' | 'reset'>>) => void
  reset: () => void
}

/** Los filtros viven fuera del componente para conservarse al abrir un cóctel y volver. */
const useFilters = create<Filters>((set) => ({
  query: '',
  category: null,
  bases: [],
  strengths: [],
  methods: [],
  flavors: [],
  set: (p) => set(p),
  reset: () => set({ query: '', category: null, bases: [], strengths: [], methods: [], flavors: [] }),
}))

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

const SEARCH_INDEX = new Map<string, string>(
  COCKTAILS.map((c: Cocktail) => [
    c.id,
    norm(
      [c.name, c.category, c.base, ...c.ingredients.map((l) => INGREDIENT_MAP[l.i].name)].join(' '),
    ),
  ]),
)

function applyFilters(f: Filters): Cocktail[] {
  const words = norm(f.query).split(/\s+/).filter(Boolean)
  return COCKTAILS.filter((c) => {
    if (words.length) {
      const hay = SEARCH_INDEX.get(c.id)!
      if (!words.every((w) => hay.includes(w))) return false
    }
    if (f.category && c.category !== f.category) return false
    if (f.bases.length && !f.bases.includes(c.base)) return false
    if (f.strengths.length && !f.strengths.includes(c.strength)) return false
    if (f.methods.length && !f.methods.includes(c.method)) return false
    if (f.flavors.length && !f.flavors.every((k) => c.flavor[k] >= 4)) return false
    return true
  }).sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

function FilterSheet({ onClose }: { onClose: () => void }) {
  const f = useFilters()
  const Group = <T extends string>({
    title,
    options,
    value,
    onToggle,
    label,
  }: {
    title: string
    options: T[]
    value: T[]
    onToggle: (v: T) => void
    label?: (v: T) => string
  }) => (
    <div className="group">
      <h4>{title}</h4>
      <div className="wrap">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`chip${value.includes(o) ? ' on' : ''}`}
            aria-pressed={value.includes(o)}
            onClick={() => onToggle(o)}
          >
            {label ? label(o) : o}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Sheet title="Filtros" onClose={onClose}>
      {Group({ title: 'Licor base', options: BASES, value: f.bases, onToggle: (v) => f.set({ bases: toggle(f.bases, v) }) })}
      {Group({ title: 'Fuerza', options: STRENGTHS, value: f.strengths, onToggle: (v) => f.set({ strengths: toggle(f.strengths, v) }) })}
      {Group({
        title: 'Sabor marcado',
        options: FLAVOR_KEYS.filter((k) => k !== 'fuerte'),
        value: f.flavors,
        onToggle: (v) => f.set({ flavors: toggle(f.flavors, v) }),
        label: (k) => FLAVOR_LABELS[k],
      })}
      {Group({ title: 'Preparación', options: METHODS, value: f.methods, onToggle: (v) => f.set({ methods: toggle(f.methods, v) }) })}
      <div className="actions">
        <button type="button" className="btn grow" onClick={() => f.reset()}>
          Limpiar
        </button>
        <button type="button" className="btn primary grow" onClick={onClose}>
          Ver resultados
        </button>
      </div>
    </Sheet>
  )
}

export function ExplorePage() {
  const f = useFilters()
  const [open, setOpen] = useState(false)
  const results = useMemo(
    () => applyFilters(f),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f.query, f.category, f.bases, f.strengths, f.methods, f.flavors],
  )
  const activeCount = f.bases.length + f.strengths.length + f.methods.length + f.flavors.length
  const anyFilter = activeCount > 0 || f.category !== null || f.query !== ''

  return (
    <>
      <header className="topbar">
        <h1>Explorar</h1>
        <Link to="/ajustes" className="icon-btn" aria-label="Ajustes">
          <Icon name="settings" />
        </Link>
      </header>
      <main className="page">
        <div className="row">
          <label className="search" style={{ flex: 1 }}>
            <Icon name="search" />
            <input
              type="search"
              placeholder="Buscar cóctel o ingrediente"
              value={f.query}
              onChange={(e) => f.set({ query: e.target.value })}
              aria-label="Buscar"
            />
          </label>
          <button
            type="button"
            className={`icon-btn${activeCount ? ' on' : ''}`}
            style={{ width: 46, height: 46, border: '1px solid var(--line)', background: 'var(--surface)', position: 'relative' }}
            aria-label={`Filtros${activeCount ? ` (${activeCount} activos)` : ''}`}
            onClick={() => setOpen(true)}
          >
            <Icon name="filter" />
            {activeCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--accent)',
                  color: 'var(--accent-ink)',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  minWidth: 18,
                  height: 18,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {activeCount}
              </span>
            )}
          </button>
        </div>

        <div className="chips" role="group" aria-label="Tipo de cóctel">
          <button type="button" className={`chip${f.category === null ? ' on' : ''}`} onClick={() => f.set({ category: null })}>
            Todos
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip${f.category === c ? ' on' : ''}`}
              aria-pressed={f.category === c}
              onClick={() => f.set({ category: f.category === c ? null : c })}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="count">
          {results.length} {results.length === 1 ? 'cóctel' : 'cócteles'}
          {anyFilter && (
            <>
              {' · '}
              <button type="button" style={{ color: 'var(--accent)' }} onClick={() => f.reset()}>
                Limpiar filtros
              </button>
            </>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState title="Sin resultados" hint="Prueba con otra búsqueda o quita algunos filtros." cocktail="martini" />
        ) : (
          <div className="grid">
            {results.map((c) => (
              <CocktailCard key={c.id} cocktail={c} />
            ))}
          </div>
        )}
      </main>
      {open && <FilterSheet onClose={() => setOpen(false)} />}
    </>
  )
}
