import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TarjetaJuego } from './tarjeta-juego';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../models/videojuego';

describe('TarjetaJuego', () => {
  let component: TarjetaJuego;
  let fixture: ComponentFixture<TarjetaJuego>;

  const juegoMock: Videojuego = {
    id: 1,
    nombre: 'Test Game',
    consola: 'PC',
    genero: 'RPG',
    modalidad: 'Single Player',
    desarrollador: 'Test Studio',
    anio_lanzamiento: 2024,
    puntuacion: 8,
    verificado: true,
    portada: 'https://example.com/img.jpg',
    puntuacion_reviews: 9.2,
    fuente_reviews: 'Metacritic'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaJuego],
      providers: [
        provideRouter([]),
        {
          provide: VideojuegosService,
          useValue: { eliminarJuego: async () => true }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaJuego);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('juego', juegoMock);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
