import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  RawgGameDetail,
  RawgGameListItem,
  RawgReview,
  RawgReviewsResponse,
  RawgSearchResponse
} from '../models/rawg';
import { Videojuego } from '../models/videojuego';
import { puntajeDesdeRawg } from '../utils/puntaje-rawg';

@Injectable({ providedIn: 'root' })
export class RawgService {
  buscando = signal(false);

  private buildUrl(path: string, params: Record<string, string>): string {
    if (environment.production) {
      const qs = new URLSearchParams(params);
      return `/api/rawg/${path}?${qs}`;
    }
    if (!environment.rawgApiKey) {
      throw new Error('RAWG API key no configurada');
    }
    const qs = new URLSearchParams({ ...params, key: environment.rawgApiKey });
    return `https://api.rawg.io/api/${path}?${qs}`;
  }

  async buscarJuegos(query: string): Promise<RawgGameListItem[]> {
    if (!query.trim()) return [];
    this.buscando.set(true);
    try {
      const url = this.buildUrl('games', { search: query.trim(), page_size: '8' });
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data: RawgSearchResponse = await response.json();
      return data.results ?? [];
    } finally {
      this.buscando.set(false);
    }
  }

  async obtenerDetalle(rawgId: number): Promise<RawgGameDetail | null> {
    try {
      const url = environment.production
        ? `/api/rawg/games/${rawgId}`
        : `https://api.rawg.io/api/games/${rawgId}?key=${environment.rawgApiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return null;
    }
  }

  async obtenerReviews(rawgId: number): Promise<RawgReview[]> {
    try {
      const url = environment.production
        ? `/api/rawg/games/${rawgId}/reviews?page_size=5`
        : `https://api.rawg.io/api/games/${rawgId}/reviews?key=${environment.rawgApiKey}&page_size=5`;
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data: RawgReviewsResponse = await response.json();
      return data.results ?? [];
    } catch {
      return [];
    }
  }

  async sincronizarReviews(
    rawgId: number
  ): Promise<Pick<Videojuego, 'puntuacion_reviews' | 'fuente_reviews'> | null> {
    const detalle = await this.obtenerDetalle(rawgId);
    if (!detalle) return null;
    const puntaje = puntajeDesdeRawg(detalle);
    if (!puntaje) return null;
    return {
      puntuacion_reviews: puntaje.valor,
      fuente_reviews: puntaje.fuente
    };
  }

  async mapearAVideojuego(item: RawgGameListItem): Promise<Omit<Videojuego, 'id'>> {
    const detalle = await this.obtenerDetalle(item.id);
    const game = detalle ?? item;
    const puntaje = puntajeDesdeRawg(game);
    const anio = game.released ? new Date(game.released).getFullYear() : new Date().getFullYear();

    let videoUrl = '';
    if (detalle?.movies?.length) {
      videoUrl = detalle.movies[0].data.max;
    } else if (detalle?.clip?.clip) {
      videoUrl = detalle.clip.clip;
    }

    const enlaceCompra = game.stores?.[0]?.url ?? '';

    return {
      nombre: game.name,
      consola: game.platforms?.map(p => p.platform.name).join(', ') ?? 'PC',
      genero: game.genres?.map(g => g.name).join(', ') ?? '',
      modalidad: 'Single Player',
      desarrollador: game.developers?.[0]?.name ?? '',
      anio_lanzamiento: anio,
      puntuacion: puntaje?.valor ?? 5,
      verificado: true,
      portada: game.background_image ?? undefined,
      enlace_compra: enlaceCompra || undefined,
      horas_promedio: game.playtime > 0 ? game.playtime : undefined,
      rawg_id: game.id,
      video_url: videoUrl || undefined,
      puntuacion_reviews: puntaje?.valor,
      fuente_reviews: puntaje?.fuente
    };
  }

  async vincularJuegoExistente(
    juego: Videojuego,
    item: RawgGameListItem
  ): Promise<Omit<Videojuego, 'id'> | null> {
    const mapped = await this.mapearAVideojuego(item);
    return {
      ...mapped,
      modalidad: juego.modalidad,
      puntuacion: juego.puntuacion,
      verificado: juego.verificado || mapped.verificado
    };
  }

  async actualizarDesdeRawg(juego: Videojuego): Promise<Omit<Videojuego, 'id'> | null> {
    if (!juego.rawg_id) return null;
    const detalle = await this.obtenerDetalle(juego.rawg_id);
    if (!detalle) return null;
    const mapped = await this.mapearAVideojuego(detalle);
    return {
      ...mapped,
      modalidad: juego.modalidad,
      puntuacion: juego.puntuacion,
      verificado: juego.verificado
    };
  }
}
