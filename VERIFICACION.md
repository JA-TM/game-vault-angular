# GAME VAULT ANGULAR — Checklist de verificación v1.9.1

Guía para validar la app en **local**, **CI** y **producción** (Vercel).

**URL producción:** https://game-vault-angular.vercel.app  
**Repositorio:** https://github.com/JA-TM/game-vault-angular  
**Tag actual:** `v1.9.1`

---

## 1. Entorno y dependencias

- [ ] `npm install` sin errores
- [ ] `rawgApiKey` en `src/environments/environment.ts` (solo local; **no commitear**)
- [ ] `RAWG_API_KEY` configurada en Vercel (Production, Preview, Development)

---

## 2. Base de datos (Supabase)

- [ ] `supabase/migration-v1.8.sql` ejecutada (`rawg_id`, `video_url`, `puntuacion_reviews`, `fuente_reviews`)
- [ ] `supabase/migration-v1.9.sql` ejecutada (`puntuacion` y `puntuacion_reviews` como `numeric(4,1)`)
- [ ] Guardar ficha con puntuación decimal (ej. **7.3**) sin error PATCH

---

## 3. Build y tests

```bash
npm test    # 10 tests OK
npm run build
```

- [ ] Tests pasan (7 archivos, 10 tests)
- [ ] Build sin errores → `dist/game-vault-angular`

---

## 4. CI (GitHub Actions)

- [ ] Workflow **CI** en verde tras push a `main`
- [ ] Pasos: `npm ci` → `npm run build` → `npm test`

---

## 5. Boot overlay y audio (v1.9.1)

| Paso | Esperado |
|------|----------|
| Recargar página (F5) | Boot terminal visible de nuevo |
| Clic **ENTER GAME VAULT** | Música inicia en loop |
| Volumen del sistema/navegador | Audio respeta el nivel del usuario (sin cap al 45 %) |
| Parlante 🔊/🔇 | Pausa/reanuda en la sesión actual |
| `prefers-reduced-motion: reduce` | Boot sin autoplay de audio |
| Footer + boot | Créditos SoundFlakes CC BY 4.0 visibles |

Archivos: `boot-overlay/`, `audio.service.ts`, `audio-control/`, `public/audio/horizon-unknown.mp3`

---

## 6. RAWG — búsqueda, vincular y sync

- [ ] Listado: skeleton mientras carga
- [ ] Formulario: buscar juego RAWG → autocompletar campos
- [ ] Detalle: botón **[ sync RAWG ]** actualiza puntuación y horas
- [ ] Puntuación automática: Metacritic÷10 o `rating×2` (escala 1–10)
- [ ] Badge **verificado** coherente tras vincular
- [ ] Proxy producción: `/api/rawg/*` responde (sin CORS en Vercel)

---

## 7. UI y CRUD

- [ ] Listado: ordenar por nombre, año, nota, reviews
- [ ] Filtro **SOLO VERIFICADOS**
- [ ] Tarjetas: portada, puntajes animados, modal confirmación al eliminar
- [ ] Detalle: video YouTube, enlace comprar, reviews RAWG
- [ ] Formulario: crear / editar / volver con toast `/?ok=1`
- [ ] Subtítulo header muestra **v1.9.1**

---

## 8. Despliegue Vercel

- [ ] Push a `main` dispara deploy automático
- [ ] Bundle JS contiene string `v1.9.1`
- [ ] App accesible en URL de producción
- [ ] Tag `v1.9.1` en GitHub apunta al commit de release

---

## 9. Regresión rápida post-deploy

1. Abrir producción → boot → ENTER → música
2. Recargar → boot de nuevo
3. Abrir un juego con `rawg_id` → sync RAWG
4. Crear/editar juego con nota decimal
5. Silenciar con parlante → recargar → boot → ENTER → música otra vez

---

## Historial de tags verificados

| Tag | Fecha | Notas |
|-----|-------|-------|
| v1.9.1 | 2026-06-30 | Boot cada recarga; volumen 100 % relativo |
| v1.9 | 2026-06-30 | Audio loop, boot overlay, migración numeric |
| v1.8 | — | Integración RAWG completa |
