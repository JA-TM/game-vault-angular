import { Injectable, signal, computed } from '@angular/core';
import { Videojuego, OrdenCampo } from '../models/videojuego';
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
  cargando = signal(false);
  soloVerificados = signal(false);
  ordenCampo = signal<OrdenCampo>('nombre');
  ordenAsc = signal(true);
  porPagina = 6;

  juegosFiltrados = computed(() => {
    let lista = this.juegos();
    const texto = this.filtro().toLowerCase();
    if (texto) {
      lista = lista.filter(j =>
        j.nombre.toLowerCase().includes(texto) ||
        j.consola.toLowerCase().includes(texto) ||
        j.genero.toLowerCase().includes(texto)
      );
    }
    if (this.soloVerificados()) {
      lista = lista.filter(j => j.verificado);
    }
    const campo = this.ordenCampo();
    const asc = this.ordenAsc();
    return [...lista].sort((a, b) => {
      let va: string | number = '';
      let vb: string | number = '';
      switch (campo) {
        case 'nombre': va = a.nombre.toLowerCase(); vb = b.nombre.toLowerCase(); break;
        case 'anio': va = a.anio_lanzamiento; vb = b.anio_lanzamiento; break;
        case 'puntuacion': va = a.puntuacion; vb = b.puntuacion; break;
        case 'puntuacion_reviews': va = a.puntuacion_reviews ?? 0; vb = b.puntuacion_reviews ?? 0; break;
      }
      if (va < vb) return asc ? -1 : 1;
      if (va > vb) return asc ? 1 : -1;
      return 0;
    });
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

  notificarOk(texto: string) {
    this.mostrarMensaje(texto, 'ok');
  }

  private prepararPayload(juego: Omit<Videojuego, 'id'>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    for (const [clave, valor] of Object.entries(juego)) {
      if (valor === undefined || valor === null || valor === '') continue;
      payload[clave] = valor;
    }
    return payload;
  }

  private async mensajeErrorSupabase(response: Response, fallback: string): Promise<string> {
    try {
      const data = await response.json();
      const detalle = data.message ?? data.error ?? data.hint;
      if (detalle) {
        return `${fallback}: ${detalle}`;
      }
    } catch {
      /* respuesta no JSON */
    }
    return `${fallback} (HTTP ${response.status})`;
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
    this.cargando.set(true);
    try {
      const response = await fetch(this.url, { headers: this.headers });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error();
      this.juegos.set(data);
      this.ajustarPaginaActual();
    } catch {
      this.mostrarMensaje('Error al cargar los registros', 'error');
    } finally {
      this.cargando.set(false);
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
        body: JSON.stringify(this.prepararPayload(juego))
      });
      if (!response.ok) {
        const msg = await this.mensajeErrorSupabase(response, 'Error al crear el registro');
        this.mostrarMensaje(msg, 'error');
        return false;
      }
      await this.cargarJuegos();
      this.mostrarMensaje('Registro creado correctamente', 'ok');
      return true;
    } catch {
      this.mostrarMensaje('Error al crear el registro', 'error');
      return false;
    }
  }

  async editarJuego(
    id: number,
    juego: Omit<Videojuego, 'id'>,
    opciones?: { silencioso?: boolean }
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...this.headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(this.prepararPayload(juego))
      });
      if (!response.ok) {
        if (!opciones?.silencioso) {
          const msg = await this.mensajeErrorSupabase(response, 'Error al actualizar el registro');
          this.mostrarMensaje(msg, 'error');
        }
        return false;
      }
      this.juegos.update(lista =>
        lista.map(j => (j.id === id ? { ...j, ...juego, id } : j))
      );
      if (opciones?.silencioso) {
        return true;
      }
      await this.cargarJuegos();
      this.mostrarMensaje('Registro actualizado correctamente', 'ok');
      return true;
    } catch {
      if (!opciones?.silencioso) {
        this.mostrarMensaje('Error al actualizar el registro', 'error');
      }
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

  setOrden(campo: OrdenCampo) {
    if (this.ordenCampo() === campo) {
      this.ordenAsc.update(v => !v);
    } else {
      this.ordenCampo.set(campo);
      this.ordenAsc.set(true);
    }
    this.paginaActual.set(1);
  }

  toggleSoloVerificados() {
    this.soloVerificados.update(v => !v);
    this.paginaActual.set(1);
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
