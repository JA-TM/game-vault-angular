# GAME VAULT ANGULAR

Catálogo CRUD de videojuegos con **Angular 22**, **signals**, **Supabase**, **RAWG API**, **audio ambiente** y estética **Cyberpunk 2077**.

**Versión actual:** v1.9.1

→ **[ESPECIFICACION.md](./ESPECIFICACION.md)** · **[VERIFICACION.md](./VERIFICACION.md)**

## Inicio rápido

```bash
npm install
# Configura rawgApiKey en src/environments/environment.ts (desarrollo)
ng serve
```

## Variables de entorno

| Variable | Dónde | Uso |
|----------|-------|-----|
| `rawgApiKey` | `environment.ts` | Desarrollo local |
| `RAWG_API_KEY` | Vercel | Producción (proxy `/api/rawg`) |

## Supabase (migraciones)

| Archivo | Contenido |
|---------|-----------|
| `supabase/migration-v1.8.sql` | Columnas RAWG (`rawg_id`, `video_url`, reviews…) |
| `supabase/migration-v1.9.sql` | Puntuaciones decimales (`numeric(4,1)`) |

## Audio (v1.9+)

- Pista: **"Horizon of the Unknown"** by [SoundFlakes](https://freesound.org/s/592086/) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Archivo: `public/audio/horizon-unknown.mp3`
- **Cada recarga** muestra boot overlay → **ENTER GAME VAULT** inicia el loop
- Volumen al **100 % relativo** (respeta el volumen del sistema/navegador del usuario)
- Mini parlante (esquina inferior derecha) para silenciar/reanudar en la sesión actual

## Verificación pre-deploy

Checklist completo en **[VERIFICACION.md](./VERIFICACION.md)** (Supabase, CI, audio, RAWG, Vercel).

Resumen rápido:

- [ ] Migraciones v1.8 y v1.9 ejecutadas en Supabase
- [ ] `RAWG_API_KEY` en Vercel
- [ ] `ng test` y `ng build` OK
- [ ] Boot overlay + audio tras recargar
- [ ] Vincular juego RAWG y guardar puntuación decimal (ej. 7.3)

## Scripts

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Desarrollo |
| `ng build` | Producción |
| `ng test` | Tests (Vitest) |

## Stack

- Angular 22 · Signals · Supabase · RAWG · Vercel

## Créditos

| Recurso | Licencia |
|---------|----------|
| [RAWG.io](https://rawg.io) | Datos de juegos |
| [SoundFlakes — Horizon of the Unknown](https://freesound.org/s/592086/) | CC BY 4.0 |
