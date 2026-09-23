import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { leerErrorApi } from '../../comun/error-api';
import { hoy } from '../../comun/fechas';
import { EmpleadoRequest, NOMBRES_PUESTO, Puesto } from '../empleado';
import { EmpleadoService } from '../empleado.service';

/**
 * Alta y edición de empleados con el mismo formulario:
 * /empleados/nuevo → alta; /empleados/3 → edición del empleado 3.
 * Las validaciones las hace el backend; aquí solo se muestran sus mensajes.
 */
@Component({
  selector: 'app-empleado-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './empleado-formulario.component.html',
})
export class EmpleadoFormularioComponent implements OnInit {
  private readonly empleadoService = inject(EmpleadoService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);

  /** El id de la URL, o null si es un alta. */
  protected readonly id = this.ruta.snapshot.paramMap.has('id')
    ? Number(this.ruta.snapshot.paramMap.get('id'))
    : null;

  protected readonly nombresPuesto = NOMBRES_PUESTO;
  protected readonly puestos = Object.keys(NOMBRES_PUESTO) as Puesto[];

  protected readonly formulario = this.fb.group({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    puesto: 'EMPLEADO' as Puesto,
    fechaAlta: hoy(),
  });

  /** Si el empleado que se edita está dado de baja (para volver a la lista con el filtro correcto). */
  private activo = true;

  protected readonly mensajeError = signal<string | null>(null);
  protected readonly errores = signal<Record<string, string>>({});
  protected readonly guardando = signal(false);

  ngOnInit(): void {
    if (this.id === null) {
      return;
    }
    // Edición: rellenar el formulario con los datos actuales
    this.empleadoService.buscarPorId(this.id).subscribe({
      next: (empleado) => {
        this.activo = empleado.activo;
        this.formulario.setValue({
          nombre: empleado.nombre,
          apellidos: empleado.apellidos,
          email: empleado.email,
          telefono: empleado.telefono ?? '',
          puesto: empleado.puesto,
          fechaAlta: empleado.fechaAlta,
        });
      },
      error: (respuesta: HttpErrorResponse) => this.mensajeError.set(leerErrorApi(respuesta).mensaje),
    });
  }

  protected guardar(): void {
    const valores = this.formulario.getRawValue();
    // Un teléfono vacío se envía como null (es opcional en la API)
    const peticion: EmpleadoRequest = { ...valores, telefono: valores.telefono.trim() || null };

    const operacion = this.id === null
      ? this.empleadoService.crear(peticion)
      : this.empleadoService.actualizar(this.id, peticion);

    this.guardando.set(true);
    this.mensajeError.set(null);
    this.errores.set({});
    operacion.subscribe({
      next: () => this.volverALaLista(),
      error: (respuesta: HttpErrorResponse) => {
        const error = leerErrorApi(respuesta);
        this.mensajeError.set(error.mensaje);
        this.errores.set(error.errores);
        this.guardando.set(false);
      },
    });
  }

  /** Si el empleado está de baja, vuelve con el filtro de bajas activado para que se vea en la lista. */
  protected volverALaLista(): void {
    this.router.navigate(['/empleados'], { queryParams: this.activo ? {} : { bajas: true } });
  }
}
