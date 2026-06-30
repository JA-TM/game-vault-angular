import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RawgService } from '../../services/rawg.service';
import { TarjetaJuego } from '../../components/tarjeta-juego/tarjeta-juego';
import { Videojuego, OrdenCampo } from '../../models/videojuego';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [TarjetaJuego, FormsModule],
  templateUrl: './listado.html',
  styleUrl: './listado.css'
})
export class Listado implements OnInit {
  private videojuegosService = inject(VideojuegosService);
  private rawgService = inject(RawgService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  juegos = this.videojuegosService.juegosPaginados;
  juegosFiltrados = this.videojuegosService.juegosFiltrados;
  filtro = this.videojuegosService.filtro;
  mensaje = this.videojuegosService.mensaje;
  paginaActual = this.videojuegosService.paginaActual;
  totalPaginas = this.videojuegosService.totalPaginas;
  cargando = this.videojuegosService.cargando;
  soloVerificados = this.videojuegosService.soloVerificados;
  ordenCampo = this.videojuegosService.ordenCampo;
  ordenAsc = this.videojuegosService.ordenAsc;

  async ngOnInit() {
    await this.videojuegosService.cargarJuegos();
    void this.sincronizarDesdeRawgVisibles();
    const ok = this.route.snapshot.queryParamMap.get('ok');
    if (ok === '1') {
      this.videojuegosService.notificarOk('Registro guardado correctamente');
    }
  }

  private async sincronizarDesdeRawgVisibles() {
    for (const j of this.juegos()) {
      if (!j.rawg_id) continue;

      const sync = await this.rawgService.sincronizarDesdeRawg(j.rawg_id);
      if (!sync) continue;

      const sinCambios =
        sync.puntuacion === j.puntuacion &&
        sync.puntuacion_reviews === j.puntuacion_reviews &&
        sync.fuente_reviews === j.fuente_reviews &&
        sync.horas_promedio === j.horas_promedio;
      if (sinCambios) continue;

      await this.videojuegosService.editarJuego(j.id, { ...j, ...sync }, { silencioso: true });
    }
  }

  onFiltro(texto: string) {
    this.videojuegosService.setFiltro(texto);
  }

  onEditar(juego: Videojuego) {
    this.router.navigate(['/editar', juego.id]);
  }

  irANuevo() {
    this.router.navigate(['/nuevo']);
  }

  anterior() {
    this.videojuegosService.paginaAnterior();
  }

  siguiente() {
    this.videojuegosService.paginaSiguiente();
  }

  setOrden(campo: OrdenCampo) {
    this.videojuegosService.setOrden(campo);
  }

  toggleVerificados() {
    this.videojuegosService.toggleSoloVerificados();
  }
}
