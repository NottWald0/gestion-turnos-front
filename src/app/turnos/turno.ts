// Tipos que reflejan los DTOs del backend (TurnoResponse, TurnoRequest y CuadranteSemanalResponse).
// Fechas como 'AAAA-MM-DD' y horas como 'HH:mm'.

export type TipoTurno = 'MANANA' | 'TARDE' | 'CIERRE';

/** Texto que se muestra en pantalla para cada tipo de turno. */
export const NOMBRES_TIPO: Record<TipoTurno, string> = {
  MANANA: 'Mañana',
  TARDE: 'Tarde',
  CIERRE: 'Cierre',
};

/** Lo que devuelve la API. */
export interface Turno {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: TipoTurno;
  horas: number;
  notas: string | null;
}

/** Lo que se envía para crear o editar un turno. */
export interface TurnoRequest {
  empleadoId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: TipoTurno;
  notas: string | null;
}

/** La semana de lunes a domingo con sus turnos y las horas de cada empleado. */
export interface CuadranteSemanal {
  desde: string;
  hasta: string;
  dias: Dia[];
  horasPorEmpleado: HorasEmpleado[];
}

export interface Dia {
  fecha: string;
  diaSemana: string;
  turnos: Turno[];
}

export interface HorasEmpleado {
  empleadoId: number;
  empleadoNombre: string;
  horas: number;
}
