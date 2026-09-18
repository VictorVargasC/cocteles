import type { Ingredient, IngredientCategory } from '../types'

type S = [string, string]
const ing = (
  id: string,
  name: string,
  category: IngredientCategory,
  flavor: string,
  description: string,
  subs: S[] = [],
  staple = false,
): Ingredient => ({
  id,
  name,
  category,
  flavor,
  description,
  substitutes: subs.map(([id, note]) => ({ id, note })),
  staple: staple || undefined,
})

export const INGREDIENTS: Ingredient[] = [
  // Licor base
  ing('ron-blanco', 'Ron blanco', 'Licor base', 'Ligero, dulce, neutro', 'Ron joven y suave, la base de mojitos, daiquiris y piñas coladas.', [
    ['ron-oscuro', 'Más profundo y meloso; el cóctel queda más oscuro.'],
    ['cachaca', 'Más herbal y vegetal; funciona bien en cócteles con lima.'],
    ['vodka', 'Más neutro, sin el toque dulce de caña.'],
  ]),
  ing('ron-oscuro', 'Ron dorado / oscuro', 'Licor base', 'Caramelo, vainilla, especiado', 'Ron añejado con notas de melaza, caramelo y madera.', [
    ['ron-blanco', 'Más ligero; pierde la profundidad de caramelo.'],
    ['whisky', 'Notas de madera parecidas, menos dulce.'],
  ]),
  ing('tequila', 'Tequila', 'Licor base', 'Agave, cítrico, terroso', 'Destilado de agave azul. Blanco para cócteles frescos, reposado si quieres más suavidad.', [
    ['vodka', 'Pierde el carácter de agave, pero mantiene la estructura.'],
  ]),
  ing('vodka', 'Vodka', 'Licor base', 'Neutro, limpio', 'El destilado más neutro: deja brillar a los otros ingredientes.', [
    ['ginebra', 'Aporta notas herbales de enebro.'],
    ['ron-blanco', 'Un poco más dulce y con carácter.'],
  ]),
  ing('ginebra', 'Ginebra', 'Licor base', 'Herbal, enebro, cítrico', 'Destilado aromatizado con enebro y botánicos.', [
    ['vodka', 'Más neutro, sin el toque herbal.'],
  ]),
  ing('whisky', 'Whisky / Bourbon', 'Licor base', 'Madera, vainilla, caramelo', 'Destilado de cereal añejado. El bourbon es más dulce; el escocés, más ahumado.', [
    ['ron-oscuro', 'Más dulce y menos amaderado.'],
    ['brandy', 'Afrutado y suave.'],
  ]),
  ing('brandy', 'Brandy / Coñac', 'Licor base', 'Uva, frutal, cálido', 'Destilado de vino; el coñac es su versión más fina.', [
    ['whisky', 'Más seco y amaderado.'],
    ['ron-oscuro', 'Más dulce.'],
  ]),
  ing('cachaca', 'Cachaça', 'Licor base', 'Caña fresca, herbal, vegetal', 'Destilado brasileño de jugo de caña; base de la caipirinha.', [
    ['ron-blanco', 'La sustitución más común; algo más suave y dulce.'],
    ['vodka', 'Neutro, sin el sabor a caña.'],
  ]),

  // Licores
  ing('triple-sec', 'Triple sec / Cointreau', 'Licores', 'Naranja dulce, cítrico', 'Licor de naranja seca. Redondea y endulza cócteles cítricos.', [
    ['jarabe-simple', 'Solo dulzor; agrega una tira de cáscara de naranja para el aroma.'],
  ]),
  ing('licor-cafe', 'Licor de café (Kahlúa)', 'Licores', 'Café, dulce, vainilla', 'Licor dulce de café, muy usado en postres líquidos.', [
    ['cafe-espresso', 'Más amargo: añade jarabe simple.'],
  ]),
  ing('amaretto', 'Amaretto', 'Licores', 'Almendra, dulce, marzapán', 'Licor italiano con sabor a almendra amarga.', [
    ['licor-cafe', 'Cambia almendra por café; también dulce.'],
  ]),
  ing('crema-irlandesa', 'Crema irlandesa (Baileys)', 'Licores', 'Cremoso, whisky, chocolate', 'Licor cremoso de whisky, crema y cacao.', [
    ['licor-cafe', 'Menos cremoso; mezcla con un poco de leche.'],
  ]),
  ing('curacao-azul', 'Curaçao azul', 'Licores', 'Naranja dulce, cítrico', 'Licor de naranja teñido de azul; mismo sabor que el triple sec.', [
    ['triple-sec', 'Idéntico en sabor, pero sin el color azul.'],
  ]),
  ing('licor-durazno', 'Licor de durazno', 'Licores', 'Durazno, dulce, frutal', 'Licor dulce de durazno.', [
    ['durazno', 'Usa durazno fresco licuado con un poco de jarabe.'],
  ]),
  ing('licor-coco', 'Licor de coco (Malibu)', 'Licores', 'Coco, dulce, suave', 'Ron aromatizado con coco, ligero y dulce.', [
    ['crema-coco', 'Más cremoso y sin alcohol; añade ron blanco.'],
  ]),
  ing('campari', 'Campari', 'Licores', 'Amargo, cítrico, herbal', 'Aperitivo italiano rojo, intensamente amargo.', [
    ['aperol', 'Más dulce y suave, menos amargo.'],
  ]),
  ing('aperol', 'Aperol', 'Licores', 'Naranja amarga, dulce, ligero', 'Aperitivo italiano anaranjado, más suave y dulce que el Campari.', [
    ['campari', 'Más amargo e intenso; usa un poco menos.'],
  ]),
  ing('vermut-dulce', 'Vermut dulce', 'Licores', 'Hierbas, dulce, especiado', 'Vino aromatizado y fortificado, rojizo y dulce.', [
    ['vermut-seco', 'Menos dulce y más herbal.'],
  ]),
  ing('vermut-seco', 'Vermut seco', 'Licores', 'Herbal, seco, floral', 'Vino aromatizado seco, clave en el martini.', [
    ['vermut-dulce', 'Más dulce y especiado.'],
  ]),
  ing('licor-cassis', 'Licor de casis', 'Licores', 'Grosella negra, dulce, frutal', 'Licor dulce de grosella negra.', [
    ['jugo-arandano', 'Menos dulce; sin alcohol.'],
  ]),

  // Jugos
  ing('jugo-limon', 'Jugo de limón', 'Jugos', 'Ácido, brillante', 'Jugo fresco de limón amarillo. Da el punto ácido a los sours.', [
    ['jugo-lima', 'Un poco más amargo y aromático.'],
  ]),
  ing('jugo-lima', 'Jugo de lima', 'Jugos', 'Ácido, verde, aromático', 'Jugo fresco de lima (limón verde), el ácido por excelencia del trópico.', [
    ['jugo-limon', 'Más suave y menos amargo.'],
  ]),
  ing('jugo-naranja', 'Jugo de naranja', 'Jugos', 'Dulce, cítrico', 'Mejor recién exprimido.', [
    ['jugo-toronja', 'Más amargo y ácido.'],
    ['jugo-pina', 'Más tropical y dulce.'],
  ]),
  ing('jugo-pina', 'Jugo de piña', 'Jugos', 'Dulce, tropical, ácido', 'Base de los cócteles tropicales.', [
    ['jugo-naranja', 'Más ligero; pierde lo tropical.'],
    ['jugo-maracuya', 'Más ácido y aromático.'],
  ]),
  ing('jugo-arandano', 'Jugo de arándano', 'Jugos', 'Ácido, tánico, frutal', 'Jugo rojo, ligeramente astringente.', [
    ['granadina', 'Solo color y dulzor; añade limón para acidez.'],
  ]),
  ing('jugo-toronja', 'Jugo de toronja', 'Jugos', 'Amargo, ácido, fresco', 'Jugo de pomelo rosado o blanco.', [
    ['jugo-naranja', 'Menos amargo y más dulce.'],
  ]),
  ing('jugo-tomate', 'Jugo de tomate', 'Jugos', 'Salado, umami, vegetal', 'Base salada del Bloody Mary y la michelada.'),
  ing('jugo-maracuya', 'Jugo de maracuyá', 'Jugos', 'Ácido, aromático, tropical', 'Pulpa de fruta de la pasión: muy aromática.', [
    ['jugo-pina', 'Más dulce y menos intenso.'],
  ]),

  // Mezcladores
  ing('agua-tonica', 'Agua tónica', 'Mezcladores', 'Amargo (quinina), burbujeante', 'Refresco con quinina y burbujas.', [
    ['agua-mineral', 'Sin el toque amargo; añade unas gotas de limón.'],
  ]),
  ing('agua-mineral', 'Agua mineral / Soda', 'Mezcladores', 'Neutro, burbujeante', 'Agua con gas para alargar y refrescar.', [
    ['agua-tonica', 'Añade amargor.'],
    ['refresco-lima', 'Añade dulzor y sabor a lima-limón.'],
  ]),
  ing('ginger-beer', 'Ginger beer', 'Mezcladores', 'Jengibre picante, dulce', 'Refresco de jengibre con más picor que el ginger ale.', [
    ['ginger-ale', 'Más suave y dulce; añade un chorrito de limón.'],
  ]),
  ing('ginger-ale', 'Ginger ale', 'Mezcladores', 'Jengibre suave, dulce', 'Refresco de jengibre suave.', [
    ['ginger-beer', 'Más picante e intenso.'],
    ['refresco-lima', 'Sin jengibre; dulce y cítrico.'],
  ]),
  ing('cola', 'Refresco de cola', 'Mezcladores', 'Dulce, caramelo, especiado', 'Refresco de cola.'),
  ing('refresco-lima', 'Refresco lima-limón', 'Mezcladores', 'Dulce, cítrico, burbujeante', 'Tipo Sprite o 7Up.', [
    ['agua-mineral', 'Sin dulzor; añade jarabe simple.'],
  ]),
  ing('agua', 'Agua', 'Mezcladores', 'Neutro', 'Agua natural.', [], true),

  // Endulzantes y cremas
  ing('jarabe-simple', 'Jarabe simple', 'Endulzantes y cremas', 'Dulce, neutro', 'Azúcar disuelta en agua caliente (1:1). Se integra al instante en bebidas frías.', [
    ['azucar', 'Disuélvela bien en el jugo antes de agregar hielo.'],
  ]),
  ing('granadina', 'Granadina', 'Endulzantes y cremas', 'Dulce, granada, frutal', 'Jarabe rojo de granada; da color y dulzor.', [
    ['jarabe-simple', 'Solo dulzor, sin color rojo.'],
  ]),
  ing('azucar', 'Azúcar', 'Endulzantes y cremas', 'Dulce', 'Blanca o morena.', [
    ['jarabe-simple', 'Se integra mejor en frío.'],
  ], true),
  ing('crema-coco', 'Crema de coco', 'Endulzantes y cremas', 'Coco, dulce, cremoso', 'Crema espesa y dulce de coco (Coco López).', [
    ['licor-coco', 'Menos espeso y con alcohol.'],
  ]),
  ing('crema-leche', 'Crema de leche', 'Endulzantes y cremas', 'Cremoso, neutro', 'Crema líquida para dar cuerpo.'),
  ing('crema-batida', 'Crema batida', 'Endulzantes y cremas', 'Cremoso, dulce', 'Para coronar cócteles cremosos.'),

  // Frutas y hierbas
  ing('menta', 'Hierbabuena / Menta', 'Frutas y hierbas', 'Fresco, herbal, mentolado', 'Hojas frescas, aplastar suavemente para liberar el aroma.'),
  ing('lima', 'Lima', 'Frutas y hierbas', 'Ácido, aromático', 'Fruta cítrica verde; se usa en gajos, ruedas o jugo.', [
    ['limon', 'Un poco más suave.'],
  ]),
  ing('limon', 'Limón', 'Frutas y hierbas', 'Ácido, brillante', 'Fruta cítrica amarilla.', [
    ['lima', 'Más aromática y algo más amarga.'],
  ]),
  ing('naranja', 'Naranja', 'Frutas y hierbas', 'Dulce, cítrico', 'En rodaja o cáscara para guarnición.', [
    ['limon', 'Más ácido.'],
  ]),
  ing('fresa', 'Fresa', 'Frutas y hierbas', 'Dulce, frutal, ácido suave', 'Fresca o congelada para licuados.', [
    ['durazno', 'Menos ácido y más dulce.'],
  ]),
  ing('pina', 'Piña', 'Frutas y hierbas', 'Dulce, tropical, ácido', 'Fruta fresca o en trozos para licuar y decorar.', [
    ['jugo-pina', 'Para licuar o mezclar; no sirve para decorar.'],
  ]),
  ing('platano', 'Plátano', 'Frutas y hierbas', 'Dulce, cremoso', 'Para versiones licuadas.', [
    ['durazno', 'Menos cremoso; más ácido.'],
  ]),
  ing('durazno', 'Durazno', 'Frutas y hierbas', 'Dulce, floral, suave', 'Puré de durazno maduro.', [
    ['licor-durazno', 'Más dulce y con alcohol.'],
  ]),
  ing('cafe-espresso', 'Café espresso', 'Frutas y hierbas', 'Amargo, tostado', 'Recién hecho y frío.', [
    ['licor-cafe', 'Más dulce y con alcohol; reduce el jarabe simple.'],
  ]),
  ing('cereza', 'Cereza marrasquino', 'Frutas y hierbas', 'Dulce, almendra', 'Cereza confitada para adornar.', [
    ['fresa', 'Usa una fresa como adorno.'],
  ]),
  ing('aceituna', 'Aceituna', 'Frutas y hierbas', 'Salado, salmuera', 'Guarnición clásica del martini.', [
    ['limon', 'Una cáscara de limón cambia el estilo a más cítrico.'],
  ]),
  ing('apio', 'Apio', 'Frutas y hierbas', 'Fresco, vegetal, salado', 'Tallo fresco como guarnición del Bloody Mary.'),
  ing('canela', 'Canela', 'Frutas y hierbas', 'Cálido, dulce, especiado', 'En rama o molida.', [
    ['azucar', 'Solo dulzor.'],
  ]),

  // Vinos y cerveza
  ing('espumoso', 'Champán / Prosecco', 'Vinos y cerveza', 'Seco, burbujeante, afrutado', 'Vino espumoso; el prosecco es más frutal y económico.', [
    ['agua-mineral', 'Sin alcohol; pierde carácter de vino.'],
  ]),
  ing('vino-tinto', 'Vino tinto', 'Vinos y cerveza', 'Frutal, tánico', 'Base de la sangría.', [
    ['jugo-arandano', 'Sin alcohol; pierde cuerpo.'],
  ]),
  ing('cerveza', 'Cerveza clara', 'Vinos y cerveza', 'Ligero, amargo suave, burbujeante', 'Lager fría.', [
    ['agua-mineral', 'Sin alcohol; pierde el sabor a cerveza.'],
  ]),

  // Otros
  ing('hielo', 'Hielo', 'Otros', 'Frío', 'Cubos o picado.', [], true),
  ing('sal', 'Sal', 'Otros', 'Salado', 'Para escarchar copas.', [], true),
  ing('angostura', 'Angostura', 'Otros', 'Amargo, especiado, aromático', 'Bitter aromático; se usa en gotas.', [
    ['campari', 'Amargo pero más dulce y cítrico; usa poco.'],
  ]),
  ing('salsa-inglesa', 'Salsa inglesa', 'Otros', 'Umami, salado, ácido', 'Da profundidad al Bloody Mary y la michelada.'),
  ing('salsa-picante', 'Salsa picante', 'Otros', 'Picante, ácido', 'Tipo Tabasco o Valentina.'),
  ing('clara-huevo', 'Clara de huevo', 'Otros', 'Neutro, espuma', 'Da textura sedosa y espuma a los sours.'),

  // — Añadidos con el listado del Club del Barman —
  ing('pisco', 'Pisco', 'Licor base', 'Uva, floral, seco', 'Aguardiente de uva de Perú y Chile; base del pisco sour.', [
    ['brandy', 'También de uva, pero más suave y con madera.'],
    ['vodka', 'Más neutro, sin el carácter de uva.'],
  ]),
  ing('calvados', 'Calvados', 'Licor base', 'Manzana, madera, frutal', 'Brandy de manzana de Normandía.', [
    ['brandy', 'Menos manzana, más uva.'],
  ]),
  ing('licor-albaricoque', 'Licor de albaricoque (Apricot brandy)', 'Licores', 'Albaricoque, dulce, frutal', 'Licor dulce de albaricoque.', [
    ['licor-durazno', 'Más floral y suave; el resultado es parecido.'],
  ]),
  ing('marrasquino', 'Licor de marrasquino', 'Licores', 'Cereza amarga, almendra, floral', 'Licor de cereza marrasca (tipo Luxardo). No es el jarabe de las cerezas de adorno.', [
    ['amaretto', 'Toque de almendra, más dulce.'],
  ]),
  ing('crema-violeta', 'Crème de violette', 'Licores', 'Floral, violeta, dulce', 'Licor de violetas; da el color lila y aroma floral del Aviation.', [
    ['triple-sec', 'Pierde lo floral; el cóctel queda más cítrico.'],
  ]),
  ing('grand-marnier', 'Grand Marnier', 'Licores', 'Naranja, coñac, dulce', 'Licor de naranja amarga con base de coñac.', [
    ['triple-sec', 'Más ligero y menos profundo.'],
  ]),
  ing('galliano', 'Galliano', 'Licores', 'Vainilla, anís, hierbas', 'Licor italiano dorado con vainilla y anís.', [
    ['licor-durazno', 'Solo dulzor frutal: pierde el toque de vainilla y anís.'],
  ]),
  ing('licor-moras', 'Licor de moras (Crème de mûre)', 'Licores', 'Mora, dulce, frutal', 'Licor dulce de mora negra.', [
    ['licor-cassis', 'Muy parecido: grosella negra en lugar de mora.'],
    ['licor-frambuesa', 'Más dulce y aromático.'],
  ]),
  ing('licor-frambuesa', 'Licor de frambuesa (Chambord)', 'Licores', 'Frambuesa, dulce, frutal', 'Licor dulce de frambuesa.', [
    ['licor-moras', 'Sabor a mora; similar en dulzor.'],
    ['licor-cassis', 'Más ácido y oscuro.'],
  ]),
  ing('lillet', 'Lillet Blanc', 'Licores', 'Cítrico, floral, ligeramente amargo', 'Aperitivo francés de vino blanco y cítricos.', [
    ['vermut-seco', 'Más herbal y seco.'],
  ]),
  ing('drambuie', 'Drambuie', 'Licores', 'Miel, whisky, hierbas', 'Licor escocés de whisky, miel y especias.', [
    ['amaretto', 'Dulce con almendra en vez de miel.'],
  ]),
  ing('licor-cerezas', 'Licor de cerezas (Cherry Heering)', 'Licores', 'Cereza, dulce, almendra', 'Licor de cereza oscuro.', [
    ['marrasquino', 'Más seco y aromático; añade un poco de granadina.'],
  ]),
  ing('benedictine', 'Bénédictine', 'Licores', 'Hierbas, miel, especiado', 'Licor francés de hierbas y especias.', [
    ['drambuie', 'También meloso y herbal.'],
  ]),
  ing('absenta', 'Absenta', 'Licores', 'Anís, herbal, intenso', 'Destilado de anís y ajenjo. Se usa en gotas.', [
    ['galliano', 'Menos intenso; da un toque anisado.'],
  ]),
  ing('kirsch', 'Kirsch', 'Licores', 'Cereza, seco, frutal', 'Aguardiente seco de cereza.', [
    ['marrasquino', 'Más dulce.'],
    ['brandy', 'Sin el toque de cereza.'],
  ]),
  ing('crema-cacao', 'Crema de cacao', 'Licores', 'Chocolate, vainilla, dulce', 'Licor dulce de cacao; blanco (incoloro) u oscuro.', [
    ['licor-cafe', 'Cambia chocolate por café.'],
  ]),
  ing('crema-menta', 'Crema de menta', 'Licores', 'Menta, dulce, fresco', 'Licor dulce de menta; verde o blanco (igual sabor).', [
    ['menta', 'Usa hojas frescas con un poco de jarabe simple.'],
  ]),
  ing('oporto', 'Oporto', 'Vinos y cerveza', 'Dulce, frutal, pasas', 'Vino fortificado portugués; el tawny es el más usado.', [
    ['vermut-dulce', 'Menos denso, más herbal.'],
  ]),
  ing('vino-blanco', 'Vino blanco seco', 'Vinos y cerveza', 'Seco, cítrico, frutal', 'Un blanco fresco y seco sirve.', [
    ['espumoso', 'Añade burbujas.'],
  ]),
  ing('nectar-agave', 'Néctar de agave', 'Endulzantes y cremas', 'Dulce, suave, vegetal', 'Endulzante líquido del agave; combina con tequila.', [
    ['jarabe-simple', 'Más neutro; usa un poco menos.'],
    ['miel', 'Más aromático.'],
  ]),
  ing('sirope-frambuesa', 'Jarabe de frambuesa', 'Endulzantes y cremas', 'Dulce, frutal, ácido suave', 'Jarabe rojo de frambuesa.', [
    ['granadina', 'Solo color y dulzor.'],
    ['licor-frambuesa', 'Con alcohol: reduce el resto.'],
  ]),
  ing('sirope-fresa', 'Jarabe de fresa', 'Endulzantes y cremas', 'Dulce, fresa', 'Jarabe de fresa.', [
    ['granadina', 'Color rojo y dulzor; menos fresa.'],
  ]),
  ing('miel', 'Miel', 'Endulzantes y cremas', 'Dulce, floral', 'Miel líquida.', [
    ['jarabe-simple', 'Más neutro.'],
    ['nectar-agave', 'Más suave.'],
  ]),
  ing('cebolla', 'Cebolla', 'Frutas y hierbas', 'Picante, fresco, vegetal', 'Rodaja muy fina como guarnición del vampiro.'),
  ing('cebollitas-vinagre', 'Cebollitas en vinagre', 'Frutas y hierbas', 'Ácido, salado', 'Cebollitas perla en vinagre (pickles); guarnición del Gibson.', [
    ['aceituna', 'Cambia al estilo martini con aceituna.'],
  ]),
  ing('chile', 'Chile / guindilla', 'Frutas y hierbas', 'Picante', 'Rodajas finas de chile fresco.', [
    ['salsa-picante', 'Unas gotas en lugar del chile fresco.'],
  ]),
  ing('salmuera-aceituna', 'Salmuera de aceituna', 'Otros', 'Salado, salmuera', 'El líquido del frasco de aceitunas.', [
    ['sal', 'Una pizca de sal con unas gotas de agua.'],
  ]),
  ing('bitter-naranja', 'Bitter de naranja', 'Otros', 'Naranja amarga, aromático', 'Bitters de naranja; se usan en gotas.', [
    ['angostura', 'Más especiado que cítrico.'],
  ]),
  ing('bitter-durazno', 'Bitter de durazno', 'Otros', 'Durazno, aromático', 'Bitters de durazno; se usan en gotas.', [
    ['angostura', 'Más especiado; usa menos.'],
  ]),
  ing('agua-azahar', 'Agua de azahar', 'Otros', 'Floral, cítrico', 'Agua floral de flor de naranjo; solo unas gotas.'),
  ing('extracto-vainilla', 'Extracto de vainilla', 'Otros', 'Vainilla, dulce', 'Unas gotas para aromatizar.'),
  ing('yema-huevo', 'Yema de huevo', 'Otros', 'Cremoso, rico', 'Da cuerpo y untuosidad.', [
    ['crema-leche', 'Menos untuosa.'],
  ]),
]

export const INGREDIENT_MAP: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
)

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  'Licor base',
  'Licores',
  'Jugos',
  'Mezcladores',
  'Endulzantes y cremas',
  'Frutas y hierbas',
  'Vinos y cerveza',
  'Otros',
]
