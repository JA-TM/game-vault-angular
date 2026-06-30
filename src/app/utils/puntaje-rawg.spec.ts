import { describe, it, expect } from 'vitest';
import { puntajeDesdeRawg } from './puntaje-rawg';

describe('puntajeDesdeRawg', () => {
  it('uses metacritic divided by 10', () => {
    const r = puntajeDesdeRawg({ metacritic: 96, rating: 4.5 });
    expect(r).toEqual({ valor: 9.6, fuente: 'Metacritic' });
  });

  it('falls back to rating times 2', () => {
    const r = puntajeDesdeRawg({ metacritic: null, rating: 4.5 });
    expect(r).toEqual({ valor: 9, fuente: 'RAWG' });
  });

  it('returns null when no data', () => {
    expect(puntajeDesdeRawg({ metacritic: null, rating: 0 })).toBeNull();
  });
});
