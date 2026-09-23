// Utilidades para trabajar con fechas en formato 'AAAA-MM-DD' (el que usa la API).

/** La fecha de hoy según el reloj del ordenador, p. ej. '2026-09-23'. */
export function hoy(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/**
 * Suma (o resta, si es negativo) días a una fecha: sumarDias('2026-09-21', 7) → '2026-09-28'.
 * Se calcula en UTC para que el cambio de hora de verano no descuadre el resultado.
 */
export function sumarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}
