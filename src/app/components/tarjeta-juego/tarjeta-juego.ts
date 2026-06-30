import { Component, input, output, inject, signal } from '@angular/core';
import { Videojuego } from '../../models/videojuego';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Router } from '@angular/router';
import { ConfirmacionModal } from '../confirmacion-modal/confirmacion-modal';
import { PuntajeAnimado } from '../puntaje-animado/puntaje-animado';

@Component({
  selector: 'app-tarjeta-juego',
  standalone: true,
  imports: [ConfirmacionModal, PuntajeAnimado],
  templateUrl: './tarjeta-juego.html',
  styleUrl: './tarjeta-juego.css'
})
export class TarjetaJuego {
  juego = input.required<Videojuego>();
  private videojuegosService = inject(VideojuegosService);
  private router = inject(Router);
  editar = output<Videojuego>();

  mostrarModal = signal(false);

  verDetalle() {
    this.router.navigate(['/detalle', this.juego().id]);
  }

  onEditar() {
    this.editar.emit(this.juego());
  }

  pedirEliminar() {
    this.mostrarModal.set(true);
  }

  cancelarEliminar() {
    this.mostrarModal.set(false);
  }

  async confirmarEliminar() {
    this.mostrarModal.set(false);
    await this.videojuegosService.eliminarJuego(this.juego().id);
  }
}
