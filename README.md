# Cocteles

Tu carta de cócteles en el celular: 104 cócteles ilustrados, favoritos, historial con calificación,
MiBar (qué puedes preparar con lo que tienes), fichas de ingredientes con sustitutos y recomendaciones.

PWA instalable, funciona sin internet. Los datos del usuario se guardan en el dispositivo (localStorage).

## Comandos

```bash
npm install
npm run dev        # desarrollo
npm run test       # pruebas de datos y lógica
npm run build      # genera dist/
npm run preview -- --host   # sirve dist/ en tu red local (para probar en el celular)
```

## Publicada

https://victorvargasc.github.io/cocteles/

Se sirve con GitHub Pages desde la rama `gh-pages`. Para publicar cambios:

```bash
npm run deploy
```

(compila y sube `dist/`; el sitio se actualiza en un par de minutos).

## Instalar en Android

Abre la URL en Chrome del celular → menú ⋮ → **Instalar app** (o "Añadir a pantalla de inicio").
Después funciona sin internet.

## Agregar cócteles

Edita `src/data/cocktails.ts` (usa los ids de `src/data/ingredients.ts`). `npm run test` valida
que los ingredientes existan y que los perfiles de sabor sean válidos.
