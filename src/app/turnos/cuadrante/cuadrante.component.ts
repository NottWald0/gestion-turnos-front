import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { hoy, sumarDias } from '../../comun/fechas';
import { CuadranteSemanal, NOMBRES_TIPO } from '../turno';
import { TurnoService } from '../turno.service';

@Component({
  selector: 'app-cuadrante',
  imports: [DatePipe],
  templateUrl: './cuadrante.component.html',
  styleUrl: './cuadrante.component.css',
})
export class CuadranteComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  // Estado de la pantalla. Son "signals": cuando cambian, Angular vuelve a pintar lo que las usa.
  protected readonly cuadrante = signal<CuadranteSemanal | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly hoy = hoy();
  protected readonly nombresTipo = NOMBRES_TIPO;

  /** Se ejecuta una vez, cuando Angular crea el componente. */
  ngOnInit(): void {
    this.cargar(this.hoy);
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
    // La petición HTTP no se envía hasta que alguien se suscribe al Observable
    this.turnoService.cuadranteSemanal(fecha).subscribe({
      next: (cuadrante) => this.cuadrante.set(cuadrante),
      error: () => this.error.set('No se ha podido cargar el cuadrante. ¿Está arrancada la API?'),
    });
  }
}
