import { Component, inject, signal, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

const STORAGE_BOOT = 'gv-boot-accepted';

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
    const reducido = prefiereMovimientoReducido();
    if (sessionStorage.getItem(STORAGE_BOOT) === '1') {
      this.visible.set(false);
      if (!reducido && !this.audioService.silenciado()) {
        void this.audioService.iniciarLoop();
      }
    }
  }

  async entrar() {
    if (this.entrando()) return;
    this.entrando.set(true);
    sessionStorage.setItem(STORAGE_BOOT, '1');

    const reducido = prefiereMovimientoReducido();
    if (!reducido) {
      await this.audioService.iniciarLoop();
    }

    this.visible.set(false);
  }
}
