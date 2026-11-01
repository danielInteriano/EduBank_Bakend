import type { Types } from "mongoose";

export enum TipoPregunta {
  VERDADERO_FALSO = "verdadero_falso",
  SELECCION_UNICA = "seleccion_unica",
  SELECCION_MULTIPLE = "seleccion_multiple",
  CORRECTO_INCORRECTO = "correcto_incorrecto",
  TERMINOS_PAREADOS = "terminos_pareados",
  COMPLETACION = "completacion",
  RESPUESTA_BREVE = "respuesta_breve",
}

export enum NivelDificultad {
  FACIL = "facil",
  MEDIA = "media",
  DIFICIL = "dificil",
}

export interface Opciones {
  opcion: string;
  esCorrecta: boolean;
}

export interface Pares {
  izquierda: string;
  derecha: string;
}

export interface Pregunta {
  usuario_id: Types.ObjectId;
  asignatura_id: Types.ObjectId;
  bloque_id: Types.ObjectId;
  tema_id: Types.ObjectId;
  grado_id: Types.ObjectId;
  tipo: TipoPregunta;
  enunciado: string;
  respuesta_correcta?: string | boolean;
  opciones?: Opciones[];
  pares?: Pares[];
  puntuacion: number;
  imagen_url?: string;
  explicacion?: string;
  dificultad?: NivelDificultad;
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export type crearQuestion = Omit<
  Pregunta,
  "usuario_id" | "activo" | "fecha_creacion" | "fecha_actualizacion"
>;

export type DatosFinales = {
  tipo: TipoPregunta;
  enunciado: string;
  respuesta_correcta?: string | boolean;
  opciones?: Opciones[];
  pares?: Pares[];
  puntuacion: number;
  imagen_url?: string;
  explicacion?: string;
  dificultad?: NivelDificultad;
  asignatura_id: Types.ObjectId | string;
  bloque_id: Types.ObjectId | string;
  tema_id: Types.ObjectId | string;
  grado_id: Types.ObjectId | string;
};

export type ActualizarQuestion = Partial<crearQuestion>;
