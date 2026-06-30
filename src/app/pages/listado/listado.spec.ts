import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Listado } from './listado';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RawgService } from '../../services/rawg.service';
import { signal } from '@angular/core';

describe('Listado', () => {
  let component: Listado;
  let fixture: ComponentFixture<Listado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listado],
      providers: [
        provideRouter([]),
        {
          provide: VideojuegosService,
          useValue: {
            juegosPaginados: signal([]),
            juegosFiltrados: signal([]),
            filtro: signal(''),
            mensaje: signal(null),
            paginaActual: signal(1),
            totalPaginas: signal(0),
            cargando: signal(false),
            soloVerificados: signal(false),
            ordenCampo: signal('nombre'),
            ordenAsc: signal(true),
            cargarJuegos: async () => {},
            setFiltro: () => {},
            setOrden: () => {},
            toggleSoloVerificados: () => {},
            paginaAnterior: () => {},
            paginaSiguiente: () => {},
            notificarOk: () => {}
          }
        },
        {
          provide: RawgService,
          useValue: {
            sincronizarReviews: async () => null
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Listado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
