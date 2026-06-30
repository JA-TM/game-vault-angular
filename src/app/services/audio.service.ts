import { Injectable, signal, computed } from '@angular/core';

const AUDIO_SRC = '/audio/horizon-unknown.mp3';
const STORAGE_MUTED = 'gv-audio-muted';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private iniciado = false;

  reproduciendo = signal(false);
  silenciado = signal(
    typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_MUTED) === 'true'
  );

  iconoParlante = computed(() => (this.silenciado() || !this.reproduciendo() ? '🔇' : '🔊'));

  private crearAudio(): HTMLAudioElement {
    const el = new Audio(AUDIO_SRC);
    el.loop = true;
    el.volume = 0.45;
    el.preload = 'auto';
    return el;
  }

  async iniciarLoop(): Promise<void> {
    if (this.silenciado()) return;

    if (!this.audio) {
      this.audio = this.crearAudio();
      this.audio.addEventListener('play', () => this.reproduciendo.set(true));
      this.audio.addEventListener('pause', () => this.reproduciendo.set(false));
    }

    if (this.iniciado && !this.audio.paused) return;

    try {
      await this.audio.play();
      this.iniciado = true;
      this.reproduciendo.set(true);
    } catch {
      this.reproduciendo.set(false);
    }
  }

  toggle(): void {
    if (!this.audio) {
      this.silenciado.set(false);
      localStorage.removeItem(STORAGE_MUTED);
      void this.iniciarLoop();
      return;
    }

    if (this.audio.paused) {
      this.silenciado.set(false);
      localStorage.removeItem(STORAGE_MUTED);
      void this.audio.play();
    } else {
      this.audio.pause();
      this.silenciado.set(true);
      localStorage.setItem(STORAGE_MUTED, 'true');
    }
  }

  detener(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.reproduciendo.set(false);
  }
}
