# Andrea Alkalay — archivo de obra

Sitio React + Vite con galerías inmersivas y un panel privado de contenido. Desde `/admin` se pueden editar los textos y las imágenes de Home, Work, Exhibitions, Statement, About, Contact, CV y los datos generales del sitio, sin modificar el diseño. Express sirve la API y el frontend desde un único proceso; PostgreSQL se gestiona con Prisma.

## Desarrollo

1. Ejecutar `npm install`.
2. Ejecutar `npm run dev`.

El sitio queda en `http://localhost:4173` y el panel en `/admin`. En desarrollo, la contraseña es `admin` y el contenido se guarda automáticamente dentro de `.local/`, sin requerir PostgreSQL. Para desarrollar contra PostgreSQL, se puede copiar `.env.example` a `.env` y ejecutar las migraciones de Prisma.

## Producción

```bash
npm ci --include=dev
npx prisma migrate deploy
npm run build
npm start
```

`render.yaml` configura un único Web Service para React + Express y una base PostgreSQL asociada.
