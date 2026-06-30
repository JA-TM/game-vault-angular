-- Migración v1.8 — ejecutar en Supabase SQL Editor
ALTER TABLE videojuegos
  ADD COLUMN IF NOT EXISTS rawg_id bigint,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS puntuacion_reviews bigint,
  ADD COLUMN IF NOT EXISTS fuente_reviews text;
