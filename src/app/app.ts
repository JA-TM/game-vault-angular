import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideojuegosService } from './services/videojuegos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private videojuegosService = inject(VideojuegosService);
  juegos = this.videojuegosService.obtenerJuegos();

  ngOnInit() {
    this.videojuegosService.cargarJuegos();
  }
}