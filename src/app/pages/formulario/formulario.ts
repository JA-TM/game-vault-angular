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
  mensaje = this.videojuegosService.mensaje;
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

  async ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = parseInt(paramId, 10);
      const juego = await this.videojuegosService.obtenerJuegoPorId(this.id);
      if (juego) {
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
      }
    }
    this.cargado.set(true);
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
      horas_promedio: this.horas_promedio ?? undefined
    };

    const ok = this.id
      ? await this.videojuegosService.editarJuego(this.id, juego)
      : await this.videojuegosService.crearJuego(juego);

    if (ok) {
      this.router.navigate(['/']);
    }
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}
