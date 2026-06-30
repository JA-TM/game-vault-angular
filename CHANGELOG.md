# Changelog — Game Vault Angular

Historial completo de versiones y cambios del proyecto.

**Versión actual:** v1.9.1

---

## v1.9.1

- Boot overlay en **cada recarga** (eliminado `sessionStorage`)
- Volumen audio al **100 % relativo** al sistema/navegador (`volume = 1`)
- Parlante mute/reanudar en sesión actual (sin persistencia en `localStorage`)
- `VERIFICACION.md` — checklist completo de pruebas
- Workflow GitHub Releases al publicar tags `v*`
- `package.json` versión 1.9.1

## v1.9

- Boot overlay estilo terminal — **ENTER GAME VAULT** inicia sesión
- Audio loop: *Horizon of the Unknown* by SoundFlakes (CC BY 4.0)
- Componente `audio-control` (parlante 🔊/🔇)
- `AudioService` con signals `reproduciendo` / `silenciado`
- Puntuación y horas automáticas desde RAWG al sync/vincular
- UI verificado coherente; botones formulario y detalle refinados
- Migración `supabase/migration-v1.9.sql` — puntuaciones decimales (`numeric(4,1)`)
- Atribución audio en footer y boot overlay

## v1.8.1 – v1.8.5 *(commits entre v1.8 y v1.9)*

- Sincronización RAWG automática al abrir listado/detalle
- Puntuación automática desde API (Metacritic÷10 o `rating×2`)
- Vincular RAWG desde formulario y detalle
- Sync horas promedio desde RAWG
- Corrección guardado con puntuaciones decimales
- Botones detalle en una línea; badge verificado coherente

## v1.8

- Integración **RAWG API** — búsqueda, vincular, sync
- Campos BD: `rawg_id`, `video_url`, `puntuacion_reviews`, `fuente_reviews`
- Portada en tarjetas y detalle
- `puntaje-animado` para nota y reviews
- Video embebido (YouTube) y enlace comprar en detalle
- Skeleton loading en listado
- Ordenación por nombre, año, nota, reviews
- Filtro **solo verificados**
- Modal de confirmación (sin `confirm()` nativo)
- Proxy Vercel `/api/rawg/[...path].js`
- CI GitHub Actions
- Migración `supabase/migration-v1.8.sql`

## v1.7

- Refactor `VideojuegosService` — validación HTTP, `obtenerJuegoPorId`, campos opcionales
- Eliminación de componente legacy `formulario-juego`
- Tests corregidos
- UI Cyberpunk refinada: fichas uniformes, efecto CRT, buscador interactivo, botones con impacto visual
- `ESPECIFICACION.md` y README documentados

## v1.6

- Rediseño completo con estilo **Cyberpunk 2077**

## v1.5

- Despliegue en **Vercel**

## v1.4

- Paginación de 6 juegos por página con `computed()`

## v1.3

- Mensajes de estado (ok/error) con animación y timeout de 3 segundos

## v1.2

- Página de **detalle** de juego

## v1.1

- Rutas con **Angular Router** — `/`, `/nuevo`, `/editar/:id`, `/detalle/:id`

## v1.0

- Estilo terminal **Umbrella / Resident Evil**

## v0.9

- Edición con **PATCH** a Supabase + carga de datos en formulario

## v0.8

- Eliminación con **DELETE** a Supabase + confirmación

## v0.7

- Formulario de creación con **POST** a Supabase

## v0.6

- Filtro de búsqueda reactivo con `computed()` por nombre, consola y género

## v0.5

- Componente `TarjetaJuego` separado con `input()` y `output()`

## v0.4

- Conexión real a **Supabase** con fetch + RLS desactivado

## v0.3

- `VideojuegosService` separado — arquitectura modelo / servicio / componente

## v0.2

- Interface `Videojuego` + signals + `@for` + `@if` con datos mock

## v0.1

- Proyecto Angular creado, arrancado y conectado a GitHub
