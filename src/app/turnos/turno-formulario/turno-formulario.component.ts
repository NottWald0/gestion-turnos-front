import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { leerErrorApi } from '../../comun/error-api';
import { hoy } from '../../comun/fechas';
import { Empleado } from '../../empleados/empleado';
import { EmpleadoService } from '../../empleados/empleado.service';
import { TurnoRequest } from '../turno';
import { TurnoService } from '../turno.service';

/**
 * Crear, editar y eliminar turnos:
 * /turnos/nuevo?fecha=2026-09-24 → alta con la fecha ya puesta; /turnos/5 → edición del turno 5.
 * Las reglas (solapamientos, horas semanales...) las comprueba el backend; aquí se muestran sus mensajes.
 */
@Component({
  selector: 'app-turno-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './turno-formulario.component.html',
})
export class TurnoFormularioComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);
  private readonly empleadoService = inject(EmpleadoService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);

  /** El id de la URL, o null si es un alta. */
  protected readonly id = this.ruta.snapshot.paramMap.has('id')
    ? Number(this.ruta.snapshot.paramMap.get('id'))
    : null;

  /** Semana del cuadrante a la que se vuelve al terminar. */
  private fechaDeVuelta = this.ruta.snapshot.queryParamMap.get('fecha') ?? hoy();

  protected readonly empleados = signal<Empleado[]>([]);

  protected readonly formulario = this.fb.group({
    empleadoId: this.fb.control<number | null>(null),
    fecha: this.fechaDeVuelta,
    horaInicio: '09:00',
    horaFin: '17:00',
    notas: '',
  });

  protected readonly mensajeError = signal<string | null>(null);
  protected readonly errores = signal<Record<string, string>>({});
  protected readonly guardando = signal(false);

  ngOnInit(): void {
    // Todos los empleados; los de baja se muestran deshabilitados en el desplegable
    this.empleadoService.listar().subscribe({
      next: (empleados) => this.empleados.set(empleados),
      error: (respuesta: HttpErrorResponse) => this.mostrarError(respuesta),
    });

    if (this.id === null) {
      return;
    }
    // Edición: rellenar el formulario con el turno actual
    this.turnoService.buscarPorId(this.id).subscribe({
      next: (turno) => {
        this.fechaDeVuelta = turno.fecha;
        this.formulario.setValue({
          empleadoId: turno.empleadoId,
          fecha: turno.fecha,
          horaInicio: turno.horaInicio,
          horaFin: turno.horaFin,
          notas: turno.notas ?? '',
        });
      },
      error: (respuesta: HttpErrorResponse) => this.mostrarError(respuesta),
    });
  }

  protected guardar(): void {
    const valores = this.formulario.getRawValue();
    const peticion: TurnoRequest = { ...valores, notas: valores.notas.trim() || null };

    const operacion = this.id === null
      ? this.turnoService.crear(peticion)
      : this.turnoService.actualizar(this.id, peticion);

    this.guardando.set(true);
    this.mensajeError.set(null);
    this.errores.set({});
    operacion.subscribe({
      next: (turno) => this.volverAlCuadrante(turno.fecha),
      error: (respuesta: HttpErrorResponse) => this.mostrarError(respuesta),
    });
  }

  protected eliminar(): void {
    if (this.id === null || !confirm('¿Eliminar este turno?')) {
      return;
    }
    this.turnoService.eliminar(this.id).subscribe({
      next: () => this.volverAlCuadrante(),
      error: (respuesta: HttpErrorResponse) => this.mostrarError(respuesta),
    });
  }

  /** Vuelve al cuadrante mostrando la semana de la fecha indicada. */
  protected volverAlCuadrante(fecha = this.fechaDeVuelta): void {
    this.router.navigate(['/cuadrante'], { queryParams: { fecha } });
  }

  private mostrarError(respuesta: HttpErrorResponse): void {
    const error = leerErrorApi(respuesta);
    this.mensajeError.set(error.mensaje);
    this.errores.set(error.errores);
    this.guardando.set(false);
  }
}
