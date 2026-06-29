import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../models/videojuego';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cargado = signal(false);
  id: number | null = null;
  nombre = '';
  consola = '';
  genero = '';
  modalidad = '';
  desarrollador = '';
  anio_lanzamiento = 2024;
  puntuacion = 5;
  verificado = false;

  async ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = parseInt(paramId);
      const response = await fetch(
        `${this.videojuegosService.url}?id=eq.${this.id}`,
        { headers: this.videojuegosService.headers }
      );
      const data = await response.json();
      const juego = data[0];
      if (juego) {
        this.nombre = juego.nombre;
        this.consola = juego.consola;
        this.genero = juego.genero;
        this.modalidad = juego.modalidad;
        this.desarrollador = juego.desarrollador;
        this.anio_lanzamiento = juego.anio_lanzamiento;
        this.puntuacion = juego.puntuacion;
        this.verificado = juego.verificado;
      }
    }
    this.cargado.set(true);
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

    this.router.navigate(['/']);
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}