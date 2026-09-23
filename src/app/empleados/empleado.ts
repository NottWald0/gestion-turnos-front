// Tipos que reflejan los DTOs del backend (EmpleadoResponse y EmpleadoRequest).
// Las fechas llegan en el JSON como texto con formato 'AAAA-MM-DD'.

export type Puesto = 'EMPLEADO' | 'ENCARGADO' | 'GERENTE';

/** Texto que se muestra en pantalla para cada puesto. */
export const NOMBRES_PUESTO: Record<Puesto, string> = {
  EMPLEADO: 'Empleado',
  ENCARGADO: 'Encargado',
  GERENTE: 'Gerente',
};

/** Lo que devuelve la API. */
export interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  puesto: Puesto;
  fechaAlta: string;
  activo: boolean;
}

/** Lo que se envía para dar de alta o editar un empleado. */
export interface EmpleadoRequest {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  puesto: Puesto;
  fechaAlta: string;
}
