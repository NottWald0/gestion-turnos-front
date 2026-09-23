import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado, EmpleadoRequest } from './empleado';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/empleados';

  /** Sin parámetro devuelve todos; con activo=true/false filtra por estado. */
  listar(activo?: boolean): Observable<Empleado[]> {
    const params: Record<string, boolean> = activo === undefined ? {} : { activo };
    return this.http.get<Empleado[]>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.url}/${id}`);
  }

  crear(empleado: EmpleadoRequest): Observable<Empleado> {
    return this.http.post<Empleado>(this.url, empleado);
  }

  actualizar(id: number, empleado: EmpleadoRequest): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.url}/${id}`, empleado);
  }

  /** Baja lógica: el empleado sigue existiendo pero con activo = false. */
  darDeBaja(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  /** Deshace la baja (activo = true). */
  reactivar(id: number): Observable<Empleado> {
    return this.http.patch<Empleado>(`${this.url}/${id}/reactivar`, null);
  }
}
