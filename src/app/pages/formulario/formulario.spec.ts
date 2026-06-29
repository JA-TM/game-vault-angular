import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Formulario } from './formulario';
import { VideojuegosService } from '../../services/videojuegos.service';

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
            crearJuego: async () => true,
            editarJuego: async () => true,
            obtenerJuegoPorId: async () => null
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
