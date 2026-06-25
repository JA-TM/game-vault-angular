import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../models/videojuego';

@Component({
  selector: 'app-formulario-juego',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario-juego.html',
  styleUrl: './formulario-juego.css'
})
export class FormularioJuego {
  private videojuegosService = inject(VideojuegosService);

  juegoCreadо = output<void>();

  nombre = '';
  consola = '';
  genero = '';
  modalidad = '';
  desarrollador = '';
  anio_lanzamiento = 2024;
  puntuacion = 5;
  verificado = false;

  async guardar() {
    if (!this.nombre || !this.consola || !this.genero || !this.modalidad || !this.desarrollador) {
      alert('Rellena todos los campos obligatorios');
      return;
    }

    const nuevoJuego: Omit<Videojuego, 'id'> = {
      nombre: this.nombre,
      consola: this.consola,
      genero: this.genero,
      modalidad: this.modalidad,
      desarrollador: this.desarrollador,
      anio_lanzamiento: this.anio_lanzamiento,
      puntuacion: this.puntuacion,
      verificado: this.verificado
    };

    await this.videojuegosService.crearJuego(nuevoJuego);
    this.juegoCreadо.emit();
    this.limpiar();
  }

  limpiar() {
    this.nombre = '';
    this.consola = '';
    this.genero = '';
    this.modalidad = '';
    this.desarrollador = '';
    this.anio_lanzamiento = 2024;
    this.puntuacion = 5;
    this.verificado = false;
  }
}