import { Routes } from '@angular/router';
import { Listado } from './pages/listado/listado';
import { Formulario } from './pages/formulario/formulario';
import { Detalle } from './pages/detalle/detalle';

export const routes: Routes = [
  { path: '', component: Listado },
  { path: 'nuevo', component: Formulario },
  { path: 'editar/:id', component: Formulario },
  { path: 'detalle/:id', component: Detalle },
  { path: '**', redirectTo: '' }
];