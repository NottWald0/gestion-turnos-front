import { Routes } from '@angular/router';
import { EmpleadoFormularioComponent } from './empleados/empleado-formulario/empleado-formulario.component';
import { EmpleadoListaComponent } from './empleados/empleado-lista/empleado-lista.component';
import { CuadranteComponent } from './turnos/cuadrante/cuadrante.component';

// Qué componente se muestra en el <router-outlet /> según la URL
export const routes: Routes = [
  { path: '', redirectTo: 'cuadrante', pathMatch: 'full' },
  { path: 'cuadrante', component: CuadranteComponent },
  { path: 'empleados', component: EmpleadoListaComponent },
  { path: 'empleados/nuevo', component: EmpleadoFormularioComponent },
  { path: 'empleados/:id', component: EmpleadoFormularioComponent },
];
