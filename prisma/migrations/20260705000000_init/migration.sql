CREATE TABLE "Artwork" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "series" TEXT NOT NULL,
  "year" INTEGER,
  "technique" TEXT,
  "description" TEXT,
  "imageUrl" TEXT NOT NULL,
  "alt" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Artwork_published_position_idx" ON "Artwork"("published", "position");

INSERT INTO "Artwork" ("title", "series", "year", "technique", "description", "imageUrl", "alt", "published", "position") VALUES
('Vista de sala I', 'Unfixed Landscapes', 2026, 'Instalación · medios mixtos', 'Paisajes heridos y sistemas inestables. Territorio, materia y memoria en el espacio.', '/exhibicion-01.png', 'Vista general de la instalación Unfixed Landscapes', true, 1),
('Vista de sala II', 'Unfixed Landscapes', 2026, 'Fotografía expandida', 'Una constelación de imágenes y materiales que desplaza los límites de la fotografía.', '/exhibicion-02.png', 'Instalaciones y obras de Unfixed Landscapes', true, 2),
('Sensitive archives', 'Unearth', 2026, 'Investigación visual', 'Excavar la imagen para revelar otras capas de sentido.', '/exhibicion-03.png', 'Obra de paisaje en sala oscura', true, 3),
('Landscape as archive', 'The Rock Cycle', 2024, 'Fotografía y materialidad', 'Una investigación sobre ciclos geológicos, transformación y huellas del tiempo.', '/exhibicion-04.png', 'Instalación vinculada al paisaje y la materia', true, 4);
