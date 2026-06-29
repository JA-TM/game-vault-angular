import { Routes } from '@angular/router';
import { Listado } from './pages/listado/listado';
import { Formulario } from './pages/formulario/formulario';

export const routes: Routes = [
  { path: '', component: Listado },
  { path: 'nuevo', component: Formulario },
  { path: 'editar/:id', component: Formulario, runGuardsAndResolvers: 'always' },
  { path: '**', redirectTo: '' }
];