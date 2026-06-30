-- Migración v1.9 — puntuaciones decimales (Metacritic 7.3, etc.)
-- Ejecutar en Supabase SQL Editor si falla al guardar tras vincular RAWG

ALTER TABLE videojuegos
  ALTER COLUMN puntuacion TYPE numeric(4,1) USING puntuacion::numeric;

ALTER TABLE videojuegos
  ALTER COLUMN puntuacion_reviews TYPE numeric(4,1) USING puntuacion_reviews::numeric;
