import { Injectable, signal, computed } from '@angular/core';
import { Videojuego } from '../models/videojuego';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  private url = `${environment.supabaseUrl}/rest/v1/videojuegos`;
  private headers = {
    'apikey': environment.supabaseKey,
    'Authorization': `Bearer ${environment.supabaseKey}`,
    'Content-Type': 'application/json'
  };

  juegos = signal<Videojuego[]>([]);
  filtro = signal<string>('');

  juegosFiltrados = computed(() => {
    const texto = this.filtro().toLowerCase();
    if (!texto) return this.juegos();
    return this.juegos().filter(j =>
      j.nombre.toLowerCase().includes(texto) ||
      j.consola.toLowerCase().includes(texto) ||
      j.genero.toLowerCase().includes(texto)
    );
  });

  async cargarJuegos() {
    const response = await fetch(this.url, { headers: this.headers });
    const data = await response.json();
    this.juegos.set(data);
  }

  async crearJuego(juego: Omit<Videojuego, 'id'>) {
    await fetch(this.url, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(juego)
    });
    await this.cargarJuegos();
  }

  obtenerJuegos() {
    return this.juegosFiltrados;
  }

  setFiltro(texto: string) {
    this.filtro.set(texto);
  }
  async eliminarJuego(id: number) {
    await fetch(`${this.url}?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.headers
    });
    await this.cargarJuegos();
  }
}