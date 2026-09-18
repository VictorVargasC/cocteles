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

## Instalar en Android

1. Publica la carpeta `dist/` en un hosting estático con HTTPS (Netlify, Vercel, GitHub Pages…).
2. Abre la URL en Chrome del celular → menú ⋮ → **Instalar app**.

## Agregar cócteles

Edita `src/data/cocktails.ts` (usa los ids de `src/data/ingredients.ts`). `npm run test` valida
que los ingredientes existan y que los perfiles de sabor sean válidos.
