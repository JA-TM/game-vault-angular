import { Component, input, output, inject } from '@angular/core';
import { Videojuego } from '../../models/videojuego';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-juego',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta-juego.html',
  styleUrl: './tarjeta-juego.css'
})
export class TarjetaJuego {
  juego = input.required<Videojuego>();
  private videojuegosService = inject(VideojuegosService);
  private router = inject(Router);
  editar = output<Videojuego>();

  verDetalle() {
    this.router.navigate(['/detalle', this.juego().id]);
  }

  onEditar() {
    this.editar.emit(this.juego());
  }

  async eliminar() {
    if (confirm(`¿Eliminar ${this.juego().nombre}?`)) {
      await this.videojuegosService.eliminarJuego(this.juego().id);
    }
  }
}