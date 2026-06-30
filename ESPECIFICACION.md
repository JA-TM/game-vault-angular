# GAME VAULT ANGULAR — Especificación técnica v1.9

Catálogo CRUD de videojuegos con Angular 22, signals, Supabase, integración RAWG, audio ambiente y estilo Cyberpunk 2077.

---

## Estructura del proyecto

```
src/app/
├── models/
│   ├── videojuego.ts
│   └── rawg.ts
├── services/
│   ├── videojuegos.service.ts
│   ├── rawg.service.ts
│   └── audio.service.ts
├── utils/
│   └── puntaje-rawg.ts
├── components/
│   ├── tarjeta-juego/
│   ├── confirmacion-modal/
│   ├── puntaje-animado/
│   ├── boot-overlay/
│   └── audio-control/
└── pages/
    ├── listado/
    ├── formulario/
    └── detalle/

public/audio/horizon-unknown.mp3   ← Pista CC BY 4.0
api/rawg/[...path].js              ← Proxy RAWG (Vercel)
supabase/migration-v1.8.sql
supabase/migration-v1.9.sql
```

---

## MODELO

**Archivo:** `src/app/models/videojuego.ts`

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| id | number | Sí (BD) |
| nombre, consola, genero, modalidad, desarrollador | string | Sí |
| anio_lanzamiento, puntuacion | number | Sí |
| verificado | boolean | Sí |
| portada, enlace_compra, video_url, fuente_reviews | string | No |
| horas_promedio, rawg_id, puntuacion_reviews | number | No |

**Ordenación:** `OrdenCampo = 'nombre' | 'anio' | 'puntuacion' | 'puntuacion_reviews'`

---

## SERVICIO — VideojuegosService

### Signals adicionales v1.8

| Signal | Descripción |
|--------|-------------|
| `cargando` | Estado de carga del listado |
| `soloVerificados` | Filtro toggle |
| `ordenCampo` / `ordenAsc` | Ordenación del listado |

### Métodos adicionales

- `notificarOk(texto)` — mensaje de éxito
- `setOrden(campo)` — ordena y alterna asc/desc
- `toggleSoloVerificados()` — filtra verificados

---

## SERVICIO — RawgService

**Archivo:** `src/app/services/rawg.service.ts`

| Método | Descripción |
|--------|-------------|
| `buscarJuegos(query)` | GET `/games?search=` |
| `obtenerDetalle(rawgId)` | GET `/games/{id}` |
| `obtenerReviews(rawgId)` | GET `/games/{id}/reviews` |
| `mapearAVideojuego(item)` | Autocompletar campos del formulario |
| `actualizarDesdeRawg(juego)` | Refrescar datos manteniendo nota/modalidad manual |

### Fórmula de puntaje reviews

```typescript
// Metacritic 0-100 → ÷10 = escala 1-10
// Fallback: rating RAWG (0-5) × 2
```

**Proxy producción:** `/api/rawg/*` (variable `RAWG_API_KEY` en Vercel)  
**Desarrollo:** `environment.rawgApiKey` → llamada directa a `api.rawg.io`

---

## RUTAS

| Ruta | Componente |
|------|------------|
| `/` | Listado |
| `/nuevo` | Formulario |
| `/editar/:id` | Formulario |
| `/detalle/:id` | Detalle |
| `**` | redirect `/` |

Query param `/?ok=1` — toast al volver de guardar.

---

## PÁGINAS

### Listado v1.8
- Skeleton cards mientras `cargando()`
- Ordenación por nombre, año, nota, reviews
- Filtro “solo verificados”
- Empty state con CTA “crear primer juego”
- Atribución RAWG

### Formulario v1.8
- Bloque **Importar desde RAWG** (búsqueda + selección)
- Campos: video_url, puntuacion_reviews, fuente_reviews, rawg_id
- Vista previa de portada
- Navega a `/?ok=1` tras guardar

### Detalle v1.8
- Portada, puntajes animados (mi nota + reviews)
- Video embebido (YouTube) o enlace
- Reviews RAWG (últimas 5)
- Botón **[ sync RAWG ]** si hay `rawg_id`
- Botón **[ comprar ]** si hay `enlace_compra`

---

## COMPONENTES

### tarjeta-juego
- Miniatura portada
- `app-puntaje-animado` para nota y reviews
- Modal de confirmación (sin `confirm()` nativo)

### confirmacion-modal / puntaje-animado
- Reutilizables standalone

---

## BASE DE DATOS SUPABASE

Ejecutar `supabase/migration-v1.8.sql`:

```sql
ALTER TABLE videojuegos
  ADD COLUMN IF NOT EXISTS rawg_id bigint,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS puntuacion_reviews bigint,
  ADD COLUMN IF NOT EXISTS fuente_reviews text;
```

---

## DESPLIEGUE

- **Vercel:** `vercel.json` + `api/rawg/[...path].js`
- **Variable entorno:** `RAWG_API_KEY`
- **Local:** `rawgApiKey` en `src/environments/environment.ts`

---

## Historial de versiones

| Tag | Descripción |
|-----|-------------|
| v0.1–v1.6 | (ver commits anteriores) |
| v1.7 | Refactor servicio, UI Cyberpunk refinada, docs |
| v1.8 | Integración RAWG, portada en fichas, puntaje reviews animado, video/comprar en detalle, skeleton loading, ordenación, filtro verificados, modal confirmación, proxy Vercel, CI GitHub Actions |
| **v1.9** | Boot overlay, audio loop (SoundFlakes CC BY 4.0), parlante mute, puntuación/horas auto RAWG, UI verificado y botones refinados, migración numeric puntuaciones |

---

## AUDIO — AudioService (v1.9)

**Archivo:** `src/app/services/audio.service.ts`  
**Pista:** `/audio/horizon-unknown.mp3`

| Método / signal | Descripción |
|-----------------|-------------|
| `iniciarLoop()` | Reproduce en loop (tras gesto usuario) |
| `toggle()` | Pausa / reanuda; persiste `gv-audio-muted` en localStorage |
| `reproduciendo` / `silenciado` | Signals de estado |

### Boot overlay

- Componente `boot-overlay` — pantalla de aceptación estilo terminal
- Clic **ENTER GAME VAULT** → inicia audio + `sessionStorage gv-boot-accepted`
- Efectos: `glitch`, `flicker`, `boot-glow` (cyan/magenta)
- Atribución SoundFlakes en overlay y footer global

### Audio control

- Botón fijo 🔊/🔇 esquina inferior derecha
- Respeta `prefers-reduced-motion`: sin autoplay en boot si está activo
