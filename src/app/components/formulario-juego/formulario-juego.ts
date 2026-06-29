import { Component, inject, input, OnChanges, output } from '@angular/core';
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
export class FormularioJuego implements OnChanges {
  private videojuegosService = inject(VideojuegosService);

  juegoEditar = input<Videojuego | null>(null);
  juegoGuardado = output<void>();

  id: number | null = null;
  nombre = '';
  consola = '';
  genero = '';
  modalidad = '';
  desarrollador = '';
  anio_lanzamiento = 2024;
  puntuacion = 5;
  verificado = false;

  ngOnChanges() {
    const j = this.juegoEditar();
    if (j) {
      this.id = j.id;
      this.nombre = j.nombre;
      this.consola = j.consola;
      this.genero = j.genero;
      this.modalidad = j.modalidad;
      this.desarrollador = j.desarrollador;
      this.anio_lanzamiento = j.anio_lanzamiento;
      this.puntuacion = j.puntuacion;
      this.verificado = j.verificado;
    } else {
      this.limpiar();
    }
  }

  async guardar() {
    if (!this.nombre || !this.consola || !this.genero || !this.modalidad || !this.desarrollador) {
      alert('Rellena todos los campos obligatorios');
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
      verificado: this.verificado
    };

    if (this.id) {
      await this.videojuegosService.editarJuego(this.id, juego);
    } else {
      await this.videojuegosService.crearJuego(juego);
    }

    this.juegoGuardado.emit();
    this.limpiar();
  }

  limpiar() {
    this.id = null;
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