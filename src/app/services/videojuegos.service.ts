import { Injectable, signal } from '@angular/core';
import { Videojuego } from '../models/videojuego';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  private url = `${environment.supabaseUrl}/rest/v1/videojuegos`;
  private headers = {
    'apikey': environment.supabaseKey,
    'Authorization': `Bearer ${environment.supabaseKey}`
  };

  juegos = signal<Videojuego[]>([]);

  async cargarJuegos() {
    const response = await fetch(this.url, { headers: this.headers });
    const data = await response.json();
    this.juegos.set(data);
  }

  obtenerJuegos() {
    return this.juegos;
  }
}