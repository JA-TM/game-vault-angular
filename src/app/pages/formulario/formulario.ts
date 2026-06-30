import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RawgService } from '../../services/rawg.service';
import { Videojuego } from '../../models/videojuego';
import { RawgGameListItem } from '../../models/rawg';
import { puntajeDesdeRawg } from '../../utils/puntaje-rawg';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario implements OnInit {
  private videojuegosService = inject(VideojuegosService);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cargado = signal(false);
  mensaje = this.videojuegosService.mensaje;
  buscandoRawg = this.rawgService.buscando;
  resultadosRawg = signal<RawgGameListItem[]>([]);
  rawgBusqueda = '';

  id: number | null = null;
  nombre = '';
  consola = '';
  genero = '';
  modalidad = '';
  desarrollador = '';
  anio_lanzamiento = 2024;
  puntuacion = 5;
  verificado = false;
  portada = '';
  enlace_compra = '';
  horas_promedio: number | null = null;
  rawg_id: number | null = null;
  video_url = '';
  puntuacion_reviews: number | null = null;
  fuente_reviews = '';

  async ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = parseInt(paramId, 10);
      const juego = await this.videojuegosService.obtenerJuegoPorId(this.id);
      if (juego) this.cargarDesdeJuego(juego);
    }
    this.cargado.set(true);
  }

  private cargarDesdeJuego(juego: Videojuego) {
    this.nombre = juego.nombre;
    this.consola = juego.consola;
    this.genero = juego.genero;
    this.modalidad = juego.modalidad;
    this.desarrollador = juego.desarrollador;
    this.anio_lanzamiento = juego.anio_lanzamiento;
    this.puntuacion = juego.puntuacion;
    this.verificado = juego.verificado;
    this.portada = juego.portada ?? '';
    this.enlace_compra = juego.enlace_compra ?? '';
    this.horas_promedio = juego.horas_promedio ?? null;
    this.rawg_id = juego.rawg_id ?? null;
    this.video_url = juego.video_url ?? '';
    this.puntuacion_reviews = juego.puntuacion_reviews ?? null;
    this.fuente_reviews = juego.fuente_reviews ?? '';
  }

  async buscarRawg() {
    try {
      this.resultadosRawg.set(await this.rawgService.buscarJuegos(this.rawgBusqueda));
    } catch {
      this.videojuegosService.notificarError('Error al buscar en RAWG. Configura RAWG_API_KEY.');
      this.resultadosRawg.set([]);
    }
  }

  previewPuntaje(item: RawgGameListItem): string {
    const p = puntajeDesdeRawg(item);
    return p ? `${p.valor}/10 (${p.fuente})` : '—';
  }

  async aplicarRawg(item: RawgGameListItem) {
    try {
      const mapped = await this.rawgService.mapearAVideojuego(item);
      this.nombre = mapped.nombre;
      this.consola = mapped.consola;
      this.genero = mapped.genero;
      this.modalidad = mapped.modalidad;
      this.desarrollador = mapped.desarrollador;
      this.anio_lanzamiento = mapped.anio_lanzamiento;
      this.puntuacion = mapped.puntuacion;
      this.verificado = mapped.verificado;
      this.portada = mapped.portada ?? '';
      this.enlace_compra = mapped.enlace_compra ?? '';
      this.horas_promedio = mapped.horas_promedio ?? null;
      this.rawg_id = mapped.rawg_id ?? null;
      this.video_url = mapped.video_url ?? '';
      this.puntuacion_reviews = mapped.puntuacion_reviews ?? null;
      this.fuente_reviews = mapped.fuente_reviews ?? '';
      this.resultadosRawg.set([]);
      this.rawgBusqueda = '';
      this.videojuegosService.notificarOk('Datos importados desde RAWG');
    } catch {
      this.videojuegosService.notificarError('No se pudo importar desde RAWG');
    }
  }

  async guardar() {
    if (!this.nombre || !this.consola || !this.genero || !this.modalidad || !this.desarrollador) {
      this.videojuegosService.notificarError('Rellena todos los campos obligatorios');
      return;
    }

    const juego: Omit<Videojuego, 'id'> = {
      nombre: this.nombre,
      consola: this.consola,
      genero: this.genero,
      modalidad: this.modalidad,
      desarrollador: this.desarrollador,
      anio_lanzamiento: this.anio_lanzamiento,
      puntuacion: this.puntuacion,
      verificado: this.verificado,
      portada: this.portada || undefined,
      enlace_compra: this.enlace_compra || undefined,
      horas_promedio: this.horas_promedio ?? undefined,
      rawg_id: this.rawg_id ?? undefined,
      video_url: this.video_url || undefined,
      puntuacion_reviews: this.puntuacion_reviews ?? undefined,
      fuente_reviews: this.fuente_reviews || undefined
    };

    const ok = this.id
      ? await this.videojuegosService.editarJuego(this.id, juego)
      : await this.videojuegosService.crearJuego(juego);

    if (ok) {
      this.router.navigate(['/'], { queryParams: { ok: 1 } });
    }
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}
