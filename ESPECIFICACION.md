# GAME VAULT ANGULAR — Especificación técnica v1.7

Catálogo CRUD de videojuegos con Angular 22, signals, Supabase y estilo Cyberpunk 2077.

---

## Estructura del proyecto

```
src/app/
├── models/
│   └── videojuego.ts          ← Interface TypeScript
├── services/
│   └── videojuegos.service.ts ← CRUD + signals + Supabase
├── components/
│   └── tarjeta-juego/         ← Card individual reutilizable
└── pages/
    ├── listado/               ← Ruta /
    ├── formulario/            ← Rutas /nuevo y /editar/:id
    └── detalle/               ← Ruta /detalle/:id

src/
├── environments/environment.ts ← URL y clave anon de Supabase
├── styles.css                  ← Variables globales, CRT, animaciones
└── app/
    ├── app.css                 ← Header (glitch en título)
    ├── app.html                ← Header + router-outlet
    └── app.routes.ts
```

> **Nota v1.7:** El componente `formulario-juego/` fue eliminado. El formulario vive en `pages/formulario/`.

---

## MODELO

**Archivo:** `src/app/models/videojuego.ts`

```typescript
export interface Videojuego {
  id: number;
  nombre: string;
  consola: string;
  genero: string;
  modalidad: string;
  desarrollador: string;
  anio_lanzamiento: number;
  puntuacion: number;
  verificado: boolean;
  portada?: string;
  enlace_compra?: string;
  horas_promedio?: number;
}
```

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| id | number | Sí (generado por BD) |
| nombre, consola, genero, modalidad, desarrollador | string | Sí |
| anio_lanzamiento, puntuacion | number | Sí |
| verificado | boolean | Sí |
| portada, enlace_compra | string | No |
| horas_promedio | number | No |

---

## SERVICIO

**Archivo:** `src/app/services/videojuegos.service.ts`  
**Inyección:** `providedIn: 'root'`

### Conexión Supabase

- `url` y `headers` **públicos** (usados también por páginas vía servicio)
- Endpoint: `{supabaseUrl}/rest/v1/videojuegos`
- Headers: `apikey`, `Authorization: Bearer`, `Content-Type: application/json`

### Signals

| Signal | Tipo | Descripción |
|--------|------|-------------|
| `juegos` | `Videojuego[]` | Listado completo desde BD |
| `filtro` | `string` | Texto de búsqueda |
| `mensaje` | `{ texto, tipo: 'ok' \| 'error' } \| null` | Toast de estado |
| `paginaActual` | `number` | Página activa (base 1) |

### Computed

| Computed | Descripción |
|----------|-------------|
| `juegosFiltrados` | Filtra por **nombre**, **consola** y **género** (case-insensitive) |
| `juegosPaginados` | **6 juegos por página** sobre `juegosFiltrados` |
| `totalPaginas` | `Math.ceil(filtrados / 6)`; devuelve **0** si no hay resultados |

### Métodos públicos

| Método | Descripción |
|--------|-------------|
| `cargarJuegos()` | GET — valida `response.ok` y que la respuesta sea array |
| `obtenerJuegoPorId(id)` | GET por id — devuelve `Videojuego \| null` |
| `crearJuego(juego)` | POST — devuelve `boolean` |
| `editarJuego(id, juego)` | PATCH — devuelve `boolean` |
| `eliminarJuego(id)` | DELETE — devuelve `boolean` |
| `obtenerJuegos()` | Devuelve signal computed `juegosFiltrados` |
| `setFiltro(texto)` | Actualiza filtro y **resetea `paginaActual` a 1** |
| `irAPagina(n)` | Navega con límites según `totalPaginas` |
| `paginaSiguiente()` / `paginaAnterior()` | Paginación incremental |
| `notificarError(texto)` | Muestra mensaje de error (validaciones en formulario) |

### Métodos privados

| Método | Descripción |
|--------|-------------|
| `mostrarMensaje(texto, tipo)` | Setea `mensaje` y lo limpia con `setTimeout` **3000 ms** |
| `ajustarPaginaActual()` | Corrige página tras cargar/eliminar si queda fuera de rango |

### Validación HTTP (v1.7)

Todas las peticiones comprueban `response.ok`. Los métodos CRUD devuelven `boolean`; la UI solo navega o confirma éxito si retornan `true`.

---

## RUTAS

**Archivo:** `src/app/app.routes.ts`

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `Listado` | Grid de juegos con búsqueda y paginación |
| `/nuevo` | `Formulario` | Crear registro (POST) |
| `/editar/:id` | `Formulario` | Editar registro (PATCH) |
| `/detalle/:id` | `Detalle` | Vista completa de un juego |
| `**` | redirect → `/` | Ruta comodín |

---

## PÁGINAS

### `pages/listado`

- `ngOnInit` → `cargarJuegos()`
- Muestra mensajes de estado (`mensaje` del servicio)
- Buscador reactivo → `setFiltro()`
- Grid de `<app-tarjeta-juego>` con datos de `juegosPaginados`
- Paginación visible solo si `totalPaginas > 1`
- Mensajes vacíos diferenciados:
  - Con filtro activo: *"No se encontraron resultados para la búsqueda."*
  - Sin filtro: *"No hay registros en la base de datos."*
- Botón `[ + nuevo registro ]` → navega a `/nuevo`
- Evento `(editar)` de tarjeta → navega a `/editar/:id`

### `pages/formulario`

- Si hay `:id` en ruta → `obtenerJuegoPorId()` y rellena campos
- Campos obligatorios: nombre, consola, género, modalidad, desarrollador
- Campos opcionales: portada (URL), enlace_compra (URL), horas_promedio
- Validación fallida → `notificarError()` (sin `alert`)
- Guardar → POST (`/nuevo`) o PATCH (`/editar/:id`) vía servicio
- Navega a `/` **solo si** el servicio retorna `true`
- Muestra banner de `mensaje` del servicio

### `pages/detalle`

- Carga juego con `obtenerJuegoPorId(id)`
- Muestra **todos los campos** incluyendo portada (imagen), horas_promedio y enlace_compra (link externo)
- Botones `[ ← volver ]` → `/` y `[ editar ]` → `/editar/:id`
- Estado *"Registro no encontrado"* si el id no existe

---

## COMPONENTE

### `components/tarjeta-juego`

| API | Tipo | Descripción |
|-----|------|-------------|
| `juego` | `input.required<Videojuego>()` | Datos del juego |
| `editar` | `output<Videojuego>()` | Emite al pulsar Editar |

**Comportamiento:**

- Clic en **título** → navega a `/detalle/:id`
- **Editar** → emite evento `editar` al padre
- **Eliminar** → `confirm()` + `eliminarJuego()` del servicio
- Altura uniforme en grid (`:host { height: 100% }`)
- Hover en ficha: iluminación intensa; resto de fichas atenuadas (`:has()`)
- Hover en botones (solo sobre el botón):
  - **Editar** → fondo sólido `#fcee0a`, texto negro
  - **Eliminar** → fondo sólido `#ff2d78`, texto negro

---

## ESTILO — Cyberpunk 2077 (v1.7)

### Global (`styles.css`)

| Elemento | Valor |
|----------|-------|
| Fondo | `#08080f` |
| Acento cyan | `#00ffe1` |
| Acento magenta | `#ff2d78` |
| Acento amarillo | `#fcee0a` |
| Fuentes | **Orbitron** (títulos) · **Share Tech Mono** (cuerpo) |
| Efecto CRT | Scanlines + viñeta + resplandor fosforescente tenue (`body::before`, `body::after`) |
| Animaciones | `glitch` (título header), `flicker` (subtítulo), `crt-idle` |

### Variables CSS (`:root`)

`--bg-deep`, `--bg-card`, `--text-primary`, `--text-muted`, `--text-label`, `--accent-cyan`, `--accent-cyan-dim`, `--accent-magenta`, `--accent-magenta-dim`, `--accent-amber`, `--border-subtle`, `--border-accent`

### Por componente

| Archivo | Contenido |
|---------|-----------|
| `app.css` | Header con glitch en "GAME VAULT" |
| `listado.css` | Grid, buscador panel interactivo, paginación, botón nuevo registro |
| `tarjeta-juego.css` | Cards, hover, botones Editar/Eliminar |
| `formulario.css` | Formulario, botón guardar lila, cancelar rojo |
| `detalle.css` | Vista detalle, portada, grid de campos |

### UI destacada

- **Buscador:** panel con icono ⌕, pulso lento (9 s), glow al focus
- **Nuevo registro:** gradiente lila/rojo, texto amarillo Cyberpunk
- **Guardar:** lila intenso sólido, texto negro, glow animado
- **Fichas:** borde superior gradiente amarillo/cyan/magenta; texto legible; hover con escala y sombra

---

## BASE DE DATOS SUPABASE

**Tabla:** `videojuegos`

| Columna | Tipo | Notas |
|---------|------|-------|
| id | bigint, identity, PK | Auto-generado |
| nombre | text | |
| consola | text | |
| genero | text | |
| modalidad | text | |
| desarrollador | text | |
| anio_lanzamiento | bigint | |
| puntuacion | bigint | |
| verificado | boolean | |
| portada | text, nullable | URL imagen |
| enlace_compra | text, nullable | URL tienda |
| horas_promedio | bigint, nullable | |

**RLS:** desactivado  
**Credenciales:** `src/environments/environment.ts` (clave anon)

---

## DESPLIEGUE

- **Plataforma:** Vercel (v1.5)
- **Build:** `ng build` → `dist/game-vault-angular`

---

## TESTS

**Runner:** Vitest (`ng test`)

| Spec | Estado |
|------|--------|
| `videojuegos.service.spec.ts` | Smoke test servicio |
| `tarjeta-juego.spec.ts` | Con mocks Router + servicio |
| `listado/formulario/detalle.spec.ts` | Con `provideRouter` y mocks |
| `app.spec.ts` | Verifica título "GAME VAULT" |

---

## Historial de versiones

| Tag | Descripción |
|-----|-------------|
| v0.1 | Proyecto Angular creado, arrancado y conectado a GitHub |
| v0.2 | Interface Videojuego + signal + @for + @if con datos mock |
| v0.3 | VideojuegosService separado — arquitectura modelo/servicio/componente |
| v0.4 | Conexión real a Supabase con fetch + RLS desactivado |
| v0.5 | Componente TarjetaJuego separado con input() y output() |
| v0.6 | Filtro de búsqueda reactivo con computed() por nombre, consola y género |
| v0.7 | Formulario de creación con POST a Supabase |
| v0.8 | Eliminación con DELETE a Supabase + confirmación |
| v0.9 | Edición con PATCH a Supabase + carga de datos en formulario |
| v1.0 | Estilo terminal Umbrella/Resident Evil |
| v1.1 | Rutas con Angular Router — /, /nuevo, /editar/:id, /detalle/:id |
| v1.2 | Página de detalle de juego |
| v1.3 | Mensajes de estado (ok/error) con animación y timeout de 3 segundos |
| v1.4 | Paginación de 6 juegos por página con computed() |
| v1.5 | Despliegue en Vercel |
| v1.6 | Rediseño completo con estilo Cyberpunk 2077 |
| **v1.7** | Refactor servicio (validación HTTP, `obtenerJuegoPorId`, campos opcionales), eliminación de `formulario-juego`, tests corregidos, UI Cyberpunk refinada (fichas uniformes, CRT, buscador interactivo, botones con impacto visual) |
