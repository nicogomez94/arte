# Andrea Alkalay — archivo de obra

Sitio React + Vite con galería inmersiva y panel privado para administrar obras. Express sirve la API y el frontend desde un único proceso; PostgreSQL se gestiona con Prisma.

## Desarrollo

1. Ejecutar `npm install`.
2. Ejecutar `npm run dev`.

El sitio queda en `http://localhost:4173` y el panel en `/admin`. En desarrollo, la contraseña es `admin` y las obras se guardan automáticamente en `.local/artworks.json`, sin requerir PostgreSQL. Para desarrollar contra PostgreSQL, se puede copiar `.env.example` a `.env` y ejecutar las migraciones de Prisma.

## Producción

```bash
npm ci --include=dev
npx prisma migrate deploy
npm run build
npm start
```

`render.yaml` configura un único Web Service para React + Express y una base PostgreSQL asociada.
