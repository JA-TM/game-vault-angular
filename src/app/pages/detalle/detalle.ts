import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RawgService } from '../../services/rawg.service';
import { Videojuego } from '../../models/videojuego';
import { RawgGameListItem, RawgReview } from '../../models/rawg';
import { PuntajeAnimado } from '../../components/puntaje-animado/puntaje-animado';
import { puntajeDesdeRawg, youtubeEmbedUrl } from '../../utils/puntaje-rawg';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [PuntajeAnimado, FormsModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videojuegosService = inject(VideojuegosService);
  private rawgService = inject(RawgService);
  private sanitizer = inject(DomSanitizer);

  juego = signal<Videojuego | null>(null);
  cargado = signal(false);
  reviews = signal<RawgReview[]>([]);
  actualizandoRawg = signal(false);
  buscandoRawg = this.rawgService.buscando;
  resultadosRawg = signal<RawgGameListItem[]>([]);
  rawgBusqueda = '';

  videoEmbed = computed(() => {
    const url = this.juego()?.video_url;
    if (!url) return null;
    const embed = youtubeEmbedUrl(url);
    return embed ? this.sanitizer.bypassSecurityTrustResourceUrl(embed) : null;
  });

  async ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      const id = parseInt(paramId, 10);
      const juego = await this.videojuegosService.obtenerJuegoPorId(id);
      this.juego.set(juego);
      if (juego?.rawg_id) {
        this.reviews.set(await this.rawgService.obtenerReviews(juego.rawg_id));
        await this.sincronizarReviewsSilencioso();
      } else if (juego) {
        this.rawgBusqueda = juego.nombre;
        await this.buscarRawg();
      }
    }
    this.cargado.set(true);
  }

  private async sincronizarReviewsSilencioso() {
    const j = this.juego();
    if (!j?.rawg_id || !j.id) return;

    const sync = await this.rawgService.sincronizarReviews(j.rawg_id);
    if (!sync) return;

    const sinCambios =
      sync.puntuacion_reviews === j.puntuacion_reviews &&
      sync.fuente_reviews === j.fuente_reviews;
    if (sinCambios) return;

    const actualizado = { ...j, ...sync };
    const ok = await this.videojuegosService.editarJuego(j.id, actualizado, { silencioso: true });
    if (ok) {
      this.juego.set(actualizado);
    }
  }

  previewPuntaje(item: RawgGameListItem): string {
    const p = puntajeDesdeRawg(item);
    return p ? `${p.valor}/10 (${p.fuente})` : '—';
  }

  async buscarRawg() {
    try {
      this.resultadosRawg.set(await this.rawgService.buscarJuegos(this.rawgBusqueda));
    } catch {
      this.videojuegosService.notificarError('Error al buscar en RAWG. Configura RAWG_API_KEY.');
      this.resultadosRawg.set([]);
    }
  }

  async vincularRawg(item: RawgGameListItem) {
    const j = this.juego();
    if (!j?.id) return;

    this.actualizandoRawg.set(true);
    try {
      const merged = await this.rawgService.vincularJuegoExistente(j, item);
      if (!merged) {
        this.videojuegosService.notificarError('No se pudo vincular con RAWG');
        return;
      }

      const ok = await this.videojuegosService.editarJuego(j.id, merged);
      if (!ok) return;

      const actualizado = { ...j, ...merged };
      this.juego.set(actualizado);
      this.resultadosRawg.set([]);
      if (actualizado.rawg_id) {
        this.reviews.set(await this.rawgService.obtenerReviews(actualizado.rawg_id));
      }
      this.videojuegosService.notificarOk('Vinculado con RAWG — reviews actualizadas');
    } finally {
      this.actualizandoRawg.set(false);
    }
  }

  async actualizarDesdeRawg() {
    const j = this.juego();
    if (!j?.rawg_id || !j.id) return;
    this.actualizandoRawg.set(true);
    try {
      const actualizado = await this.rawgService.actualizarDesdeRawg(j);
      if (!actualizado) {
        this.videojuegosService.notificarError('No se pudo actualizar desde RAWG');
        return;
      }
      const ok = await this.videojuegosService.editarJuego(j.id, actualizado);
      if (ok) {
        this.juego.set({ ...j, ...actualizado });
        this.reviews.set(await this.rawgService.obtenerReviews(j.rawg_id));
        this.videojuegosService.notificarOk('Ficha actualizada desde RAWG');
      }
    } finally {
      this.actualizandoRawg.set(false);
    }
  }

  editar() {
    this.router.navigate(['/editar', this.juego()?.id]);
  }

  volver() {
    this.router.navigate(['/']);
  }
}
