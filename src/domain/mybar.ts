import { INGREDIENT_MAP } from '../data/ingredients'
import type { Cocktail } from '../types'

export interface BarMatch {
  cocktail: Cocktail
  /** Ingredientes que faltan (sin sustituto disponible) */
  missing: string[]
  /** Ingredientes cubiertos con un sustituto de tu bar */
  substituted: { need: string; use: string }[]
}

function requiredIds(cocktail: Cocktail): string[] {
  return cocktail.ingredients
    .filter((l) => !l.opt && !INGREDIENT_MAP[l.i]?.staple)
    .map((l) => l.i)
}

export function matchCocktail(cocktail: Cocktail, have: ReadonlySet<string>, allowSubs: boolean): BarMatch {
  const missing: string[] = []
  const substituted: BarMatch['substituted'] = []
  for (const id of requiredIds(cocktail)) {
    if (have.has(id)) continue
    const sub = allowSubs
      ? INGREDIENT_MAP[id]?.substitutes.find((s) => have.has(s.id))
      : undefined
    if (sub) substituted.push({ need: id, use: sub.id })
    else missing.push(id)
  }
  // Un cóctel con varios cambios ya no es el mismo: se acepta como máximo un sustituto.
  const extra = substituted.splice(1)
  missing.push(...extra.map((x) => x.need))
  return { cocktail, missing, substituted }
}

export interface BarResult {
  ready: BarMatch[]
  almost: BarMatch[]
}

export function analyzeBar(
  cocktails: readonly Cocktail[],
  have: ReadonlySet<string>,
  allowSubs: boolean,
): BarResult {
  const ready: BarMatch[] = []
  const almost: BarMatch[] = []
  if (have.size === 0) return { ready, almost }
  for (const c of cocktails) {
    const m = matchCocktail(c, have, allowSubs)
    if (m.missing.length === 0) ready.push(m)
    else if (m.missing.length === 1) almost.push(m)
  }
  const byName = (a: BarMatch, b: BarMatch) => a.cocktail.name.localeCompare(b.cocktail.name, 'es')
  return { ready: ready.sort(byName), almost: almost.sort(byName) }
}
