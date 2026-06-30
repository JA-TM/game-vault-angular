# GAME VAULT ANGULAR

Catálogo CRUD de videojuegos con **Angular 22**, **signals**, **Supabase**, **RAWG API**, **audio ambiente** y estética **Cyberpunk 2077**.

**Versión actual:** v1.9

→ **[ESPECIFICACION.md](./ESPECIFICACION.md)**

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

## Supabase

- `supabase/migration-v1.8.sql` — columnas RAWG
- `supabase/migration-v1.9.sql` — puntuaciones decimales (`numeric`)

## Audio (v1.9)

- Pista: **"Horizon of the Unknown"** by [SoundFlakes](https://freesound.org/s/592086/) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Archivo: `public/audio/horizon-unknown.mp3`
- Boot overlay al entrar → clic **ENTER GAME VAULT** inicia loop (requerido por políticas del navegador)
- Mini parlante (esquina inferior derecha) para silenciar/reanudar

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
