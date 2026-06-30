import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BootOverlay } from './components/boot-overlay/boot-overlay';
import { AudioControl } from './components/audio-control/audio-control';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BootOverlay, AudioControl],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
