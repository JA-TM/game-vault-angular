import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../models/videojuego';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videojuegosService = inject(VideojuegosService);

  juego = signal<Videojuego | null>(null);
  cargado = signal(false);

  async ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      const response = await fetch(
        `${this.videojuegosService.url}?id=eq.${paramId}`,
        { headers: this.videojuegosService.headers }
      );
      const data = await response.json();
      this.juego.set(data[0] || null);
    }
    this.cargado.set(true);
  }

  editar() {
    this.router.navigate(['/editar', this.juego()?.id]);
  }

  volver() {
    this.router.navigate(['/']);
  }
}