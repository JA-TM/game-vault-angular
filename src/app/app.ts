import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Videojuego } from './models/videojuego';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  juegos = signal<Videojuego[]>([
    {
      id: 1,
      nombre: 'Cyberpunk 2077',
      consola: 'PC',
      genero: 'RPG',
      modalidad: 'Single Player',
      desarrollador: 'CD Projekt Red',
      anio_lanzamiento: 2020,
      puntuacion: 9,
      verificado: true
    },
    {
      id: 2,
      nombre: 'The Last of Us Part I',
      consola: 'PS5',
      genero: 'Acción',
      modalidad: 'Single Player',
      desarrollador: 'Naughty Dog',
      anio_lanzamiento: 2022,
      puntuacion: 10,
      verificado: true
    },
    {
      id: 3,
      nombre: 'Elden Ring',
      consola: 'PC',
      genero: 'RPG',
      modalidad: 'Single Player',
      desarrollador: 'FromSoftware',
      anio_lanzamiento: 2022,
      puntuacion: 10,
      verificado: false
    }
  ]);
}