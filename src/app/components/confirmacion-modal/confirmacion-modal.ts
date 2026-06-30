import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmacion-modal',
  standalone: true,
  templateUrl: './confirmacion-modal.html',
  styleUrl: './confirmacion-modal.css'
})
export class ConfirmacionModal {
  visible = input(false);
  titulo = input('Confirmar acción');
  mensaje = input('');
  confirmar = output<void>();
  cancelar = output<void>();

  onConfirmar() {
    this.confirmar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
