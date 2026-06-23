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
    horas_promedio?: number | null;
  }