import { Component, input } from '@angular/core';
import { Videojuego } from '../../models/videojuego';

@Component({
  selector: 'app-tarjeta-juego',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta-juego.html',
  styleUrl: './tarjeta-juego.css'
})
export class TarjetaJuego {
  juego = input.required<Videojuego>();
}