import type { Cocktail } from '../types'

export interface Portion {
  id: string
  ml: number
  /** Porcentaje del volumen líquido (0-100) */
  pct: number
}

/** Convierte los ml de la receta en porcentajes del volumen líquido. Ignora los opcionales. */
export function proportions(cocktail: Cocktail): Portion[] {
  const lines = cocktail.ingredients.filter((l) => l.ml > 0 && !l.opt)
  const total = lines.reduce((sum, l) => sum + l.ml, 0)
  if (total === 0) return []
  return lines.map((l) => ({ id: l.i, ml: l.ml, pct: (l.ml / total) * 100 }))
}
