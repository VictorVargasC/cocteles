import { CocktailCard, EmptyState } from '../components/parts'
import { COCKTAIL_MAP } from '../data/cocktails'
import { useStore } from '../store/useStore'

export function FavoritesPage() {
  const favorites = useStore((s) => s.favorites)
  const items = favorites.map((id) => COCKTAIL_MAP[id]).filter(Boolean)

  return (
    <>
      <header className="topbar">
        <h1>Favoritos</h1>
      </header>
      <main className="page">
        {items.length === 0 ? (
          <EmptyState
            title="Aún no tienes favoritos"
            hint="Toca el corazón en cualquier cóctel para guardarlo aquí."
            cocktail="pina-colada"
          />
        ) : (
          <div className="grid">
            {items.map((c) => (
              <CocktailCard key={c.id} cocktail={c} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
