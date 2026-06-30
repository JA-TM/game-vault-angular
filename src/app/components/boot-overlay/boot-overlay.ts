import { Component, inject, signal, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

function prefiereMovimientoReducido(): boolean {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

@Component({
  selector: 'app-boot-overlay',
  standalone: true,
  templateUrl: './boot-overlay.html',
  styleUrl: './boot-overlay.css'
})
export class BootOverlay implements OnInit {
  private audioService = inject(AudioService);

  visible = signal(true);
  entrando = signal(false);

  ngOnInit() {
    this.audioService.reiniciarSesion();
    this.visible.set(true);
  }

  async entrar() {
    if (this.entrando()) return;
    this.entrando.set(true);

    if (!prefiereMovimientoReducido()) {
      await this.audioService.iniciarLoop();
    }

    this.visible.set(false);
  }
}
