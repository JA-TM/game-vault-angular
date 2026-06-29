# GAME VAULT ANGULAR

Catálogo CRUD de videojuegos con **Angular 22**, **signals**, **Supabase** y estética **Cyberpunk 2077**.

**Versión actual:** v1.7

## Documentación

Especificación técnica completa, arquitectura, rutas, servicio, estilos e historial de versiones:

→ **[ESPECIFICACION.md](./ESPECIFICACION.md)**

## Inicio rápido

```bash
npm install
ng serve
```

Abrir `http://localhost:4200/`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Servidor de desarrollo |
| `ng build` | Build de producción |
| `ng test` | Tests unitarios (Vitest) |

## Estructura

```
src/app/
├── models/videojuego.ts
├── services/videojuegos.service.ts
├── components/tarjeta-juego/
└── pages/
    ├── listado/      → /
    ├── formulario/   → /nuevo, /editar/:id
    └── detalle/      → /detalle/:id
```

## Stack

- Angular 22 (standalone components)
- Signals + computed()
- Supabase REST API (fetch)
- Despliegue: Vercel
