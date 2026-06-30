import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RawgService } from '../../services/rawg.service';
import { Videojuego } from '../../models/videojuego';
import { RawgReview } from '../../models/rawg';
import { PuntajeAnimado } from '../../components/puntaje-animado/puntaje-animado';
import { youtubeEmbedUrl } from '../../utils/puntaje-rawg';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [PuntajeAnimado],
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
      }
    }
    this.cargado.set(true);
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
