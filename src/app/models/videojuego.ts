export interface Videojuego {
  id: number;
  nombre: string;
  consola: string;
  genero: string;
  modalidad: string;
  desarrollador: string;
  anio_lanzamiento: number;
  puntuacion: number;
  verificado: boolean;
  portada?: string;
  enlace_compra?: string;
  horas_promedio?: number;
  rawg_id?: number;
  video_url?: string;
  puntuacion_reviews?: number;
  fuente_reviews?: string;
}

export type OrdenCampo = 'nombre' | 'anio' | 'puntuacion' | 'puntuacion_reviews';
