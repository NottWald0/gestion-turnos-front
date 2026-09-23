import { HttpErrorResponse } from '@angular/common/http';

/** Forma de los errores que devuelve la API (ProblemDetail, RFC 9457). */
interface ProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
  errores?: Record<string, string>; // solo en los errores de validación (400)
}

export interface ErrorApi {
  mensaje: string;
  errores: Record<string, string>; // campo → mensaje, p. ej. { email: 'no tiene un formato válido' }
}

/** Convierte la respuesta de error de HttpClient en algo fácil de mostrar en pantalla. */
export function leerErrorApi(respuesta: HttpErrorResponse): ErrorApi {
  const cuerpo = respuesta.error as ProblemDetail | null;
  if (cuerpo?.detail) {
    return { mensaje: cuerpo.detail, errores: cuerpo.errores ?? {} };
  }
  // Sin ProblemDetail: la API no responde (apagada, sin red...)
  return { mensaje: 'No se ha podido conectar con la API. ¿Está arrancada?', errores: {} };
}
