import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideojuegosService } from './services/videojuegos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private videojuegosService = inject(VideojuegosService);
  juegos = this.videojuegosService.obtenerJuegos();
}