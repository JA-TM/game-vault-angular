import { Component, inject, computed } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-audio-control',
  standalone: true,
  template: `
    <button
      type="button"
      class="audio-control"
      (click)="toggle()"
      [attr.aria-label]="etiqueta()"
      [class.silenciado]="audio.silenciado() || !audio.reproduciendo()"
    >
      <span class="audio-icon" aria-hidden="true">{{ audio.iconoParlante() }}</span>
    </button>
  `,
  styleUrl: './audio-control.css'
})
export class AudioControl {
  audio = inject(AudioService);

  etiqueta = computed(() =>
    this.audio.silenciado() || !this.audio.reproduciendo()
      ? 'Activar música'
      : 'Silenciar música'
  );

  toggle() {
    this.audio.toggle();
  }
}
