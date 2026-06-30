import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Formulario } from './formulario';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RawgService } from '../../services/rawg.service';

describe('Formulario', () => {
  let component: Formulario;
  let fixture: ComponentFixture<Formulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formulario],
      providers: [
        provideRouter([]),
        {
          provide: VideojuegosService,
          useValue: {
            mensaje: signal(null),
            notificarError: () => {},
            notificarOk: () => {},
            crearJuego: async () => true,
            editarJuego: async () => true,
            obtenerJuegoPorId: async () => null
          }
        },
        {
          provide: RawgService,
          useValue: {
            buscando: signal(false),
            buscarJuegos: async () => [],
            mapearAVideojuego: async () => ({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Formulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
