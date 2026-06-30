import { RawgGameListItem } from '../models/rawg';

export function puntajeDesdeRawg(game: Pick<RawgGameListItem, 'metacritic' | 'rating'>): {
  valor: number;
  fuente: string;
} | null {
  if (game.metacritic != null && game.metacritic > 0) {
    return {
      valor: Math.round((game.metacritic / 10) * 10) / 10,
      fuente: 'Metacritic'
    };
  }
  if (game.rating != null && game.rating > 0) {
    return {
      valor: Math.round(game.rating * 2 * 10) / 10,
      fuente: 'RAWG'
    };
  }
  return null;
}

export function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
