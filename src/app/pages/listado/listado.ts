import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { TarjetaJuego } from '../../components/tarjeta-juego/tarjeta-juego';
import { Videojuego } from '../../models/videojuego';
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

  juegos = this.videojuegosService.obtenerJuegos();
  filtro = this.videojuegosService.filtro;

  ngOnInit() {
    this.videojuegosService.cargarJuegos();
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
}