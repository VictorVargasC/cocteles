import { INGREDIENT_MAP } from '../data/ingredients'
import { FLAVOR_KEYS, FLAVOR_LABELS, type Cocktail } from '../types'

export interface Recommendation {
  cocktail: Cocktail
  /** 0-100 */
  score: number
  /** Cócteles que te gustaron y a los que se parece más */
  because: Cocktail[]
  /** Razones legibles, ej. "Refrescante y frutal" */
  reasons: string[]
}

function cosine(a: Cocktail, b: Cocktail): number {
  let dot = 0
  let na = 0
  let nb = 0
  for (const k of FLAVOR_KEYS) {
    dot += a.flavor[k] * b.flavor[k]
    na += a.flavor[k] ** 2
    nb += b.flavor[k] ** 2
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0
}

function coreIngredients(c: Cocktail): Set<string> {
  return new Set(c.ingredients.filter((l) => !INGREDIENT_MAP[l.i]?.staple).map((l) => l.i))
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  const union = a.size + b.size - inter
  return union ? inter / union : 0
}

/** Similitud 0-1 entre dos cócteles: sabor, licor base, ingredientes y categoría. */
export function similarity(a: Cocktail, b: Cocktail): number {
  return (
    0.5 * cosine(a, b) +
    0.2 * (a.base === b.base ? 1 : 0) +
    0.2 * jaccard(coreIngredients(a), coreIngredients(b)) +
    0.1 * (a.category === b.category ? 1 : 0)
  )
}

function explain(candidate: Cocktail, liked: Cocktail[]): string[] {
  const reasons: string[] = []
  const traits = FLAVOR_KEYS.filter(
    (k) => k !== 'fuerte' && candidate.flavor[k] >= 3 && liked.some((l) => l.flavor[k] >= 3),
  )
    .sort((x, y) => candidate.flavor[y] - candidate.flavor[x])
    .slice(0, 2)
    .map((k) => FLAVOR_LABELS[k].toLowerCase())
  if (traits.length) reasons.push(`Sabor ${traits.join(' y ')}`)
  if (liked.some((l) => l.base === candidate.base) && candidate.base !== 'Sin alcohol') {
    reasons.push(`Base de ${candidate.base.toLowerCase()}`)
  }
  const shared = [...coreIngredients(candidate)].filter((id) =>
    liked.some((l) => coreIngredients(l).has(id)),
  )
  if (shared.length) {
    const names = shared.slice(0, 2).map((id) => INGREDIENT_MAP[id].name.toLowerCase())
    reasons.push(`Lleva ${names.join(' y ')}`)
  }
  return reasons
}

export interface RecommendOptions {
  likes: readonly Cocktail[]
  dislikes?: readonly Cocktail[]
  /** ids que no deben aparecer (además de los que ya te gustan) */
  exclude?: ReadonlySet<string>
  limit?: number
}

export function recommend(all: readonly Cocktail[], opts: RecommendOptions): Recommendation[] {
  const { likes, dislikes = [], exclude = new Set<string>(), limit = 12 } = opts
  if (likes.length === 0) return []
  const skip = new Set<string>([...exclude, ...likes.map((c) => c.id)])

  const results: Recommendation[] = []
  for (const cand of all) {
    if (skip.has(cand.id)) continue
    const sims = likes
      .map((l) => ({ l, s: similarity(cand, l) }))
      .sort((x, y) => y.s - x.s)
    const max = sims[0].s
    const avg = sims.reduce((sum, x) => sum + x.s, 0) / sims.length
    let score = 0.6 * max + 0.4 * avg
    if (dislikes.length) {
      score -= 0.3 * Math.max(...dislikes.map((d) => similarity(cand, d)))
    }
    const because = sims.filter((x) => x.s >= max * 0.85).slice(0, 2).map((x) => x.l)
    results.push({
      cocktail: cand,
      score: Math.max(0, Math.round(score * 100)),
      because,
      reasons: explain(cand, because),
    })
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}
