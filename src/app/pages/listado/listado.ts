import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
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

  ngOnInit() {
    this.videojuegosService.cargarJuegos();
    const ok = this.route.snapshot.queryParamMap.get('ok');
    if (ok === '1') {
      this.videojuegosService.notificarOk('Registro guardado correctamente');
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
