import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideojuegosService } from './services/videojuegos.service';
import { TarjetaJuego } from './components/tarjeta-juego/tarjeta-juego';
import { FormularioJuego } from './components/formulario-juego/formulario-juego';
import { Videojuego } from './models/videojuego';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TarjetaJuego, FormsModule, FormularioJuego],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private videojuegosService = inject(VideojuegosService);
  juegos = this.videojuegosService.obtenerJuegos();
  filtro = this.videojuegosService.filtro;
  mostrarFormulario = signal(false);
  juegoEditar = signal<Videojuego | null>(null);

  ngOnInit() {
    this.videojuegosService.cargarJuegos();
  }

  onFiltro(texto: string) {
    this.videojuegosService.setFiltro(texto);
  }

  toggleFormulario() {
    this.mostrarFormulario.update(v => !v);
    this.juegoEditar.set(null);
  }

  onEditar(juego: Videojuego) {
    this.juegoEditar.set(juego);
    this.mostrarFormulario.set(true);
  }

  onJuegoGuardado() {
    this.mostrarFormulario.set(false);
    this.juegoEditar.set(null);
  }
}