export type IngredientCategory =
  | 'Licor base'
  | 'Licores'
  | 'Jugos'
  | 'Mezcladores'
  | 'Endulzantes y cremas'
  | 'Frutas y hierbas'
  | 'Vinos y cerveza'
  | 'Otros'

export interface Ingredient {
  id: string
  name: string
  category: IngredientCategory
  /** Perfil de sabor en pocas palabras */
  flavor: string
  description: string
  substitutes: { id: string; note: string }[]
  /** Siempre disponible en MiBar (hielo, agua…) */
  staple?: boolean
}

export type Glass =
  | 'highball'
  | 'rocks'
  | 'coupe'
  | 'martini'
  | 'margarita'
  | 'hurricane'
  | 'wine'
  | 'mug'
  | 'flute'
  | 'shot'
  | 'tall'
  | 'goblet'

export type Garnish =
  | 'lime'
  | 'lemon'
  | 'orange'
  | 'mint'
  | 'cherry'
  | 'pineapple'
  | 'umbrella'
  | 'salt'
  | 'olive'
  | 'strawberry'
  | 'celery'
  | 'coffee'
  | 'cinnamon'
  | 'onion'
  | 'twist'
  | 'berries'
  | 'whipcream'
  | 'banana'

export type Layer = [color: string, weight: number]

export interface IllustrationSpec {
  glass: Glass
  /** De abajo hacia arriba */
  layers: Layer[]
  /** true = cubos; 'crushed' = hielo picado; 'big' = un cubo grande */
  ice?: boolean | 'crushed' | 'big'
  foam?: boolean
  /** burbujas (espumosos y gaseosos) */
  bubbles?: boolean
  /** montículo de bebida granizada */
  frozen?: boolean
  straw?: boolean
  garnish?: Garnish[]
}

export type Category =
  | 'Tropical'
  | 'Refrescante'
  | 'Cremoso'
  | 'Ácido'
  | 'Amargo'
  | 'Burbujeante'
  | 'Fuerte'
  | 'Frutal'

export type Base =
  | 'Ron'
  | 'Tequila'
  | 'Vodka'
  | 'Ginebra'
  | 'Whisky'
  | 'Brandy'
  | 'Cachaça'
  | 'Licor'
  | 'Vino'
  | 'Cerveza'
  | 'Pisco'
  | 'Sin alcohol'

export type Method = 'Directo' | 'Agitado' | 'Revuelto' | 'Licuado' | 'Macerado' | 'En capas'

export type Strength = 'Sin alcohol' | 'Suave' | 'Media' | 'Fuerte'

export interface FlavorProfile {
  dulce: number
  acido: number
  amargo: number
  fuerte: number
  frutal: number
  cremoso: number
  refrescante: number
}

export interface RecipeLine {
  /** id del ingrediente */
  i: string
  /** ml que aportan a las proporciones (0 = no cuenta) */
  ml: number
  /** texto a mostrar en vez de "X ml" */
  t?: string
  opt?: boolean
}

export interface Cocktail {
  id: string
  name: string
  category: Category
  base: Base
  glass: string
  method: Method
  strength: Strength
  flavor: FlavorProfile
  intro: string
  ingredients: RecipeLine[]
  steps: string[]
  garnish: string
  illustration: IllustrationSpec
}

export type FlavorKey = keyof FlavorProfile
export const FLAVOR_KEYS: FlavorKey[] = [
  'dulce',
  'acido',
  'amargo',
  'fuerte',
  'frutal',
  'cremoso',
  'refrescante',
]
export const FLAVOR_LABELS: Record<FlavorKey, string> = {
  dulce: 'Dulce',
  acido: 'Ácido',
  amargo: 'Amargo',
  fuerte: 'Alcohol',
  frutal: 'Frutal',
  cremoso: 'Cremoso',
  refrescante: 'Refrescante',
}
