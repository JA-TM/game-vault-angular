import { Injectable, signal, computed } from '@angular/core';

const AUDIO_SRC = '/audio/horizon-unknown.mp3';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio: HTMLAudioElement | null = null;

  reproduciendo = signal(false);
  silenciado = signal(false);

  iconoParlante = computed(() => (this.silenciado() || !this.reproduciendo() ? '🔇' : '🔊'));

  private crearAudio(): HTMLAudioElement {
    const el = new Audio(AUDIO_SRC);
    el.loop = true;
    el.volume = 1;
    el.preload = 'auto';
    return el;
  }

  reiniciarSesion(): void {
    this.detener();
    this.silenciado.set(false);
  }

  async iniciarLoop(): Promise<void> {
    if (this.silenciado()) return;

    if (!this.audio) {
      this.audio = this.crearAudio();
      this.audio.addEventListener('play', () => this.reproduciendo.set(true));
      this.audio.addEventListener('pause', () => this.reproduciendo.set(false));
    }

    try {
      this.audio.volume = 1;
      await this.audio.play();
      this.reproduciendo.set(true);
    } catch {
      this.reproduciendo.set(false);
    }
  }

  toggle(): void {
    if (!this.audio) {
      this.silenciado.set(false);
      void this.iniciarLoop();
      return;
    }

    if (this.audio.paused) {
      this.silenciado.set(false);
      void this.audio.play();
    } else {
      this.audio.pause();
      this.silenciado.set(true);
    }
  }

  detener(): void {
    if (!this.audio) {
      this.reproduciendo.set(false);
      return;
    }
    this.audio.pause();
    this.audio.currentTime = 0;
    this.reproduciendo.set(false);
  }
}
