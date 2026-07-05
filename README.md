# Andrea Alkalay — archivo de obra

Sitio React + Vite con galería inmersiva y panel privado para administrar obras. Express sirve la API y el frontend desde un único proceso; PostgreSQL se gestiona con Prisma.

## Desarrollo

1. Copiar `.env.example` a `.env` y configurar PostgreSQL.
2. Ejecutar `npm install`.
3. Ejecutar `npx prisma migrate dev`.
4. En dos terminales, ejecutar `npm run dev:server` y `npm run dev`.

El sitio queda en `http://localhost:5173` y el panel en `/admin`.

## Producción

```bash
npm ci --include=dev
npx prisma migrate deploy
npm run build
npm start
```

`render.yaml` configura un único Web Service para React + Express y una base PostgreSQL asociada.
