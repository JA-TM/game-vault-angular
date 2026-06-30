import { Component, input, effect, signal } from '@angular/core';

@Component({
  selector: 'app-puntaje-animado',
  standalone: true,
  template: `<span class="puntaje-animado">{{ display() }}<ng-content /></span>`,
  styles: [`
    .puntaje-animado {
      font-family: 'Orbitron', sans-serif;
      font-variant-numeric: tabular-nums;
    }
  `]
})
export class PuntajeAnimado {
  valor = input.required<number>();
  display = signal(0);

  constructor() {
    effect(() => {
      const target = this.valor();
      this.animar(target);
    });
  }

  private animar(target: number) {
    const steps = 20;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = step >= steps ? target : current + increment;
      this.display.set(Math.round(current * 10) / 10);
      if (step >= steps) clearInterval(timer);
    }, 30);
  }
}
