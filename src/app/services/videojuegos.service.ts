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
  paginaActual = signal(1);
  porPagina = 6;

  juegosFiltrados = computed(() => {
    const texto = this.filtro().toLowerCase();
    if (!texto) return this.juegos();
    return this.juegos().filter(j =>
      j.nombre.toLowerCase().includes(texto) ||
      j.consola.toLowerCase().includes(texto) ||
      j.genero.toLowerCase().includes(texto)
    );
  });

  juegosPaginados = computed(() => {
    const todos = this.juegosFiltrados();
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return todos.slice(inicio, inicio + this.porPagina);
  });

  totalPaginas = computed(() => {
    const total = this.juegosFiltrados().length;
    return total === 0 ? 0 : Math.ceil(total / this.porPagina);
  });

  private mostrarMensaje(texto: string, tipo: 'ok' | 'error') {
    this.mensaje.set({ texto, tipo });
    setTimeout(() => this.mensaje.set(null), 3000);
  }

  notificarError(texto: string) {
    this.mostrarMensaje(texto, 'error');
  }

  private ajustarPaginaActual() {
    const maxPagina = this.totalPaginas();
    if (maxPagina === 0) {
      this.paginaActual.set(1);
    } else if (this.paginaActual() > maxPagina) {
      this.paginaActual.set(maxPagina);
    }
  }

  async cargarJuegos(): Promise<void> {
    try {
      const response = await fetch(this.url, { headers: this.headers });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error();
      this.juegos.set(data);
      this.ajustarPaginaActual();
    } catch {
      this.mostrarMensaje('Error al cargar los registros', 'error');
    }
  }

  async obtenerJuegoPorId(id: number): Promise<Videojuego | null> {
    try {
      const response = await fetch(`${this.url}?id=eq.${id}`, { headers: this.headers });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error();
      return data[0] ?? null;
    } catch {
      this.mostrarMensaje('Error al cargar el registro', 'error');
      return null;
    }
  }

  async crearJuego(juego: Omit<Videojuego, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: { ...this.headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(juego)
      });
      if (!response.ok) throw new Error();
      await this.cargarJuegos();
      this.mostrarMensaje('Registro creado correctamente', 'ok');
      return true;
    } catch {
      this.mostrarMensaje('Error al crear el registro', 'error');
      return false;
    }
  }

  async editarJuego(id: number, juego: Omit<Videojuego, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...this.headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(juego)
      });
      if (!response.ok) throw new Error();
      await this.cargarJuegos();
      this.mostrarMensaje('Registro actualizado correctamente', 'ok');
      return true;
    } catch {
      this.mostrarMensaje('Error al actualizar el registro', 'error');
      return false;
    }
  }

  async eliminarJuego(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}?id=eq.${id}`, {
        method: 'DELETE',
        headers: this.headers
      });
      if (!response.ok) throw new Error();
      await this.cargarJuegos();
      this.mostrarMensaje('Registro eliminado correctamente', 'ok');
      return true;
    } catch {
      this.mostrarMensaje('Error al eliminar el registro', 'error');
      return false;
    }
  }

  obtenerJuegos() {
    return this.juegosFiltrados;
  }

  irAPagina(n: number) {
    const max = this.totalPaginas();
    if (max === 0) {
      this.paginaActual.set(1);
      return;
    }
    this.paginaActual.set(Math.min(Math.max(1, n), max));
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
    this.paginaActual.set(1);
  }
}
