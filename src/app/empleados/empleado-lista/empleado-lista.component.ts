import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { leerErrorApi } from '../../comun/error-api';
import { Empleado, NOMBRES_PUESTO } from '../empleado';
import { EmpleadoService } from '../empleado.service';

@Component({
  selector: 'app-empleado-lista',
  imports: [DatePipe, RouterLink],
  templateUrl: './empleado-lista.component.html',
})
export class EmpleadoListaComponent implements OnInit {
  private readonly empleadoService = inject(EmpleadoService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  protected readonly empleados = signal<Empleado[]>([]);
  // El filtro se guarda en la URL (/empleados?bajas=true) para no perderlo al volver de otra pantalla
  protected readonly verBajas = signal(this.ruta.snapshot.queryParamMap.get('bajas') === 'true');
  protected readonly error = signal<string | null>(null);
  protected readonly nombresPuesto = NOMBRES_PUESTO;

  ngOnInit(): void {
    this.cargar();
  }

  protected cambiarVerBajas(verBajas: boolean): void {
    this.verBajas.set(verBajas);
    // Actualiza la URL sin cambiar de pantalla; replaceUrl evita llenar el historial del navegador
    this.router.navigate([], { queryParams: verBajas ? { bajas: true } : {}, replaceUrl: true });
    this.cargar();
  }

  protected darDeBaja(empleado: Empleado): void {
    if (!confirm(`¿Dar de baja a ${empleado.nombre} ${empleado.apellidos}?`)) {
      return;
    }
    this.empleadoService.darDeBaja(empleado.id).subscribe({
      next: () => this.cargar(),
      error: (respuesta: HttpErrorResponse) => this.error.set(leerErrorApi(respuesta).mensaje),
    });
  }

  protected reactivar(empleado: Empleado): void {
    this.empleadoService.reactivar(empleado.id).subscribe({
      next: () => this.cargar(),
      error: (respuesta: HttpErrorResponse) => this.error.set(leerErrorApi(respuesta).mensaje),
    });
  }

  private cargar(): void {
    this.error.set(null);
    // Sin filtro → todos; con activo=true → solo los activos
    const activo = this.verBajas() ? undefined : true;
    this.empleadoService.listar(activo).subscribe({
      next: (empleados) => this.empleados.set(empleados),
      error: (respuesta: HttpErrorResponse) => this.error.set(leerErrorApi(respuesta).mensaje),
    });
  }
}
