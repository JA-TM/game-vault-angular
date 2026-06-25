import { Component, input, output, inject } from '@angular/core';
import { Videojuego } from '../../models/videojuego';
import { VideojuegosService } from '../../services/videojuegos.service';

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

  async eliminar() {
    if (confirm(`¿Eliminar ${this.juego().nombre}?`)) {
      await this.videojuegosService.eliminarJuego(this.juego().id);
    }
  }
}