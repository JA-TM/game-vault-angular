import { Injectable, signal, computed } from '@angular/core';
import { Videojuego } from '../models/videojuego';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  url = `${environment.supabaseUrl}/rest/v1/videojuegos`;
  headers = {
    'apikey': environment.supabaseKey,
    'Authorization': `Bearer ${environment.supabaseKey}`,
    'Content-Type': 'application/json'
  };

  juegos = signal<Videojuego[]>([]);
  filtro = signal<string>('');
  mensaje = signal<{ texto: string; tipo: 'ok' | 'error' } | null>(null);

  juegosFiltrados = computed(() => {
    const texto = this.filtro().toLowerCase();
    if (!texto) return this.juegos();
    return this.juegos().filter(j =>
      j.nombre.toLowerCase().includes(texto) ||
      j.consola.toLowerCase().includes(texto) ||
      j.genero.toLowerCase().includes(texto)
    );
  });

  private mostrarMensaje(texto: string, tipo: 'ok' | 'error') {
    this.mensaje.set({ texto, tipo });
    setTimeout(() => this.mensaje.set(null), 3000);
  }

  async cargarJuegos() {
    try {
      const response = await fetch(this.url, { headers: this.headers });
      const data = await response.json();
      this.juegos.set(data);
    } catch {
      this.mostrarMensaje('Error al cargar los registros', 'error');
    }
  }

  async crearJuego(juego: Omit<Videojuego, 'id'>) {
    try {
      await fetch(this.url, {
        method: 'POST',
        headers: { ...this.headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(juego)
      });
      await this.cargarJuegos();
      this.mostrarMensaje('Registro creado correctamente', 'ok');
    } catch {
      this.mostrarMensaje('Error al crear el registro', 'error');
    }
  }

  async editarJuego(id: number, juego: Omit<Videojuego, 'id'>) {
    try {
      await fetch(`${this.url}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...this.headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(juego)
      });
      await this.cargarJuegos();
      this.mostrarMensaje('Registro actualizado correctamente', 'ok');
    } catch {
      this.mostrarMensaje('Error al actualizar el registro', 'error');
    }
  }

  async eliminarJuego(id: number) {
    try {
      await fetch(`${this.url}?id=eq.${id}`, {
        method: 'DELETE',
        headers: this.headers
      });
      await this.cargarJuegos();
      this.mostrarMensaje('Registro eliminado correctamente', 'ok');
    } catch {
      this.mostrarMensaje('Error al eliminar el registro', 'error');
    }
  }

  obtenerJuegos() {
    return this.juegosFiltrados;
  }
  paginaActual = signal(1);
  porPagina = 6;

  juegosPaginados = computed(() => {
    const todos = this.juegosFiltrados();
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return todos.slice(inicio, inicio + this.porPagina);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.juegosFiltrados().length / this.porPagina);
  });

  irAPagina(n: number) {
    this.paginaActual.set(n);
  }

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.update(p => p + 1);
    }
  }

  paginaAnterior() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update(p => p - 1);
    }
  }

  setFiltro(texto: string) {
    this.filtro.set(texto);
  }
}