import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Detalle } from './detalle';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RawgService } from '../../services/rawg.service';

describe('Detalle', () => {
  let component: Detalle;
  let fixture: ComponentFixture<Detalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalle],
      providers: [
        provideRouter([]),
        {
          provide: VideojuegosService,
          useValue: {
            obtenerJuegoPorId: async () => null,
            notificarError: () => {},
            notificarOk: () => {},
            editarJuego: async () => true
          }
        },
        {
          provide: RawgService,
          useValue: {
            obtenerReviews: async () => [],
            actualizarDesdeRawg: async () => null
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Detalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
