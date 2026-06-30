# GAME VAULT ANGULAR

Catálogo CRUD de videojuegos con **Angular 22**, **signals**, **Supabase**, **RAWG API** y estética **Cyberpunk 2077**.

**Versión actual:** v1.8

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

## Supabase v1.8

Ejecutar `supabase/migration-v1.8.sql` antes de usar campos RAWG.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Desarrollo |
| `ng build` | Producción |
| `ng test` | Tests (Vitest) |

## Stack

- Angular 22 · Signals · Supabase · RAWG · Vercel
