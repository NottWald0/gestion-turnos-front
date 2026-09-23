import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CuadranteSemanal, Turno, TurnoRequest } from './turno';

@Injectable({ providedIn: 'root' })
export class TurnoService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/turnos';

  /** Semana que contiene la fecha indicada ('AAAA-MM-DD'); sin fecha, la semana actual. */
  cuadranteSemanal(fecha?: string): Observable<CuadranteSemanal> {
    const params: Record<string, string> = fecha ? { fecha } : {};
    return this.http.get<CuadranteSemanal>(`${this.url}/semana`, { params });
  }

  buscarPorId(id: number): Observable<Turno> {
    return this.http.get<Turno>(`${this.url}/${id}`);
  }

  crear(turno: TurnoRequest): Observable<Turno> {
    return this.http.post<Turno>(this.url, turno);
  }

  actualizar(id: number, turno: TurnoRequest): Observable<Turno> {
    return this.http.put<Turno>(`${this.url}/${id}`, turno);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
