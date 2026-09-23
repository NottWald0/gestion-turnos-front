import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { hoy, sumarDias } from '../../comun/fechas';
import { CuadranteSemanal, NOMBRES_TIPO } from '../turno';
import { TurnoService } from '../turno.service';

@Component({
  selector: 'app-cuadrante',
  imports: [DatePipe, RouterLink],
  templateUrl: './cuadrante.component.html',
  styleUrl: './cuadrante.component.css',
})
export class CuadranteComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  // Estado de la pantalla. Son "signals": cuando cambian, Angular vuelve a pintar lo que las usa.
  protected readonly cuadrante = signal<CuadranteSemanal | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly hoy = hoy();
  protected readonly nombresTipo = NOMBRES_TIPO;

  /** Se ejecuta una vez, cuando Angular crea el componente. */
  ngOnInit(): void {
    // La semana a mostrar viene en la URL (/cuadrante?fecha=2026-09-28); si no, la actual
    this.cargar(this.ruta.snapshot.queryParamMap.get('fecha') ?? this.hoy);
  }

  protected semanaAnterior(): void {
    this.cargar(sumarDias(this.cuadrante()!.desde, -7));
  }

  protected semanaSiguiente(): void {
    this.cargar(sumarDias(this.cuadrante()!.desde, 7));
  }

  protected semanaActual(): void {
    this.cargar(this.hoy);
  }

  private cargar(fecha: string): void {
    this.error.set(null);
    // Guardar la semana en la URL para no perderla al volver de otra pantalla
    this.router.navigate([], { queryParams: { fecha }, replaceUrl: true });
    // La petición HTTP no se envía hasta que alguien se suscribe al Observable
    this.turnoService.cuadranteSemanal(fecha).subscribe({
      next: (cuadrante) => this.cuadrante.set(cuadrante),
      error: () => this.error.set('No se ha podido cargar el cuadrante. ¿Está arrancada la API?'),
    });
  }
}
