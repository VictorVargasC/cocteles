import { describe, expect, it } from 'vitest'
import { COCKTAILS, COCKTAIL_MAP } from '../data/cocktails'
import { INGREDIENTS, INGREDIENT_MAP } from '../data/ingredients'
import { analyzeBar } from './mybar'
import { proportions } from './proportions'
import { recommend } from './recommend'

describe('integridad de datos', () => {
  it('tiene al menos 100 cócteles con ids únicos', () => {
    expect(COCKTAILS.length).toBeGreaterThanOrEqual(100)
    expect(new Set(COCKTAILS.map((c) => c.id)).size).toBe(COCKTAILS.length)
  })

  it('todos los ingredientes de las recetas existen', () => {
    for (const c of COCKTAILS) {
      for (const line of c.ingredients) {
        expect(INGREDIENT_MAP[line.i], `${c.id} -> ${line.i}`).toBeDefined()
      }
    }
  })

  it('los sustitutos existen y ningún ingrediente se sustituye por sí mismo', () => {
    for (const ing of INGREDIENTS) {
      for (const s of ing.substitutes) {
        expect(INGREDIENT_MAP[s.id], `${ing.id} -> ${s.id}`).toBeDefined()
        expect(s.id).not.toBe(ing.id)
      }
    }
  })

  it('cada ingrediente no básico se usa en algún cóctel', () => {
    const used = new Set(COCKTAILS.flatMap((c) => c.ingredients.map((l) => l.i)))
    const unused = INGREDIENTS.filter((i) => !used.has(i.id)).map((i) => i.id)
    expect(unused).toEqual([])
  })

  it('cada cóctel tiene pasos y perfil de sabor válido (0-5)', () => {
    for (const c of COCKTAILS) {
      expect(c.steps.length).toBeGreaterThan(0)
      for (const v of Object.values(c.flavor)) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(5)
      }
    }
  })
})

describe('proporciones', () => {
  it('suman 100 %', () => {
    const p = proportions(COCKTAIL_MAP['margarita'])
    expect(p.reduce((s, x) => s + x.pct, 0)).toBeCloseTo(100)
    expect(p[0]).toMatchObject({ id: 'tequila', ml: 50 })
  })
})

describe('MiBar', () => {
  it('con ron, lima, menta y soda se puede preparar un mojito', () => {
    const have = new Set(['ron-blanco', 'jugo-lima', 'jarabe-simple', 'menta', 'agua-mineral'])
    const { ready } = analyzeBar(COCKTAILS, have, false)
    expect(ready.map((m) => m.cocktail.id)).toContain('mojito')
  })

  it('los básicos (hielo, azúcar, sal) cuentan siempre', () => {
    const { ready } = analyzeBar(COCKTAILS, new Set(['cachaca', 'lima']), false)
    expect(ready.map((m) => m.cocktail.id)).toContain('caipirinha')
  })

  it('detecta cócteles a los que les falta un ingrediente', () => {
    const have = new Set(['ron-blanco', 'jugo-lima', 'menta', 'agua-mineral'])
    const { almost } = analyzeBar(COCKTAILS, have, false)
    const mojito = almost.find((m) => m.cocktail.id === 'mojito')
    expect(mojito?.missing).toEqual(['jarabe-simple'])
  })

  it('acepta sustitutos si se activa la opción', () => {
    const have = new Set(['ron-blanco', 'jugo-lima', 'menta', 'agua-mineral', 'azucar'])
    expect(analyzeBar(COCKTAILS, have, false).ready.map((m) => m.cocktail.id)).not.toContain('mojito')
    const withSubs = analyzeBar(COCKTAILS, have, true)
    const mojito = withSubs.ready.find((m) => m.cocktail.id === 'mojito')
    expect(mojito?.substituted).toEqual([{ need: 'jarabe-simple', use: 'azucar' }])
  })

  it('acepta como máximo un sustituto por cóctel', () => {
    const have = new Set(['vodka', 'jugo-lima', 'azucar', 'agua-mineral', 'hielo'])
    const { ready } = analyzeBar(COCKTAILS, have, true)
    expect(ready.map((m) => m.cocktail.id)).not.toContain('tom-collins')
    for (const m of ready) expect(m.substituted.length).toBeLessThanOrEqual(1)
  })

  it('un bar vacío no devuelve nada', () => {
    const r = analyzeBar(COCKTAILS, new Set(), true)
    expect(r.ready).toHaveLength(0)
    expect(r.almost).toHaveLength(0)
  })
})

describe('recomendador', () => {
  const likes = ['moscow-mule', 'pina-colada', 'mojito'].map((id) => COCKTAIL_MAP[id])

  it('no recomienda los que ya te gustan y ordena por puntaje', () => {
    const recs = recommend(COCKTAILS, { likes })
    const ids = recs.map((r) => r.cocktail.id)
    for (const l of likes) expect(ids).not.toContain(l.id)
    for (let i = 1; i < recs.length; i++) expect(recs[i - 1].score).toBeGreaterThanOrEqual(recs[i].score)
  })

  it('recomienda tragos afines a mule, colada y mojito', () => {
    const top = recommend(COCKTAILS, { likes, limit: 10 }).map((r) => r.cocktail.id)
    const expected = ['cuba-libre', 'daiquiri', 'caipirinha', 'painkiller', 'dark-n-stormy', 'chi-chi', 'miami-vice']
    expect(top.filter((id) => expected.includes(id)).length).toBeGreaterThanOrEqual(4)
  })

  it('explica por qué recomienda cada uno', () => {
    const [first] = recommend(COCKTAILS, { likes })
    expect(first.because.length).toBeGreaterThan(0)
    expect(first.reasons.length).toBeGreaterThan(0)
  })

  it('penaliza lo parecido a lo que no te gustó', () => {
    const base = recommend(COCKTAILS, { likes, limit: 200 }).find((r) => r.cocktail.id === 'cuba-libre')!
    const penalised = recommend(COCKTAILS, { likes, dislikes: [COCKTAIL_MAP['whisky-cola']], limit: 200 }).find(
      (r) => r.cocktail.id === 'cuba-libre',
    )!
    expect(penalised.score).toBeLessThan(base.score)
  })

  it('sin gustos no devuelve nada', () => {
    expect(recommend(COCKTAILS, { likes: [] })).toEqual([])
  })
})
