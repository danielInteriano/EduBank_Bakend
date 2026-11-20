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

export interface PreguntaBase {
  _id?: Types.ObjectId;
  usuario_id: Types.ObjectId;
  asignatura_id: Types.ObjectId;
  bloque_id: Types.ObjectId;
  tema_id: Types.ObjectId;
  grado_id: Types.ObjectId;
  tipo: TipoPregunta;
  enunciado: string;
  puntuacion: number;
  nivel_dificultad: NivelDificultad;
  activo: boolean;
  imagen_url?: string;
  explicacion?: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface PreguntaSeleccionUnica extends PreguntaBase {
  tipo: TipoPregunta.SELECCION_UNICA;
  opciones: Opciones[];
}

export interface PreguntaSeleccionMultiple extends PreguntaBase {
  tipo: TipoPregunta.SELECCION_MULTIPLE;
  opciones: Opciones[];
}

export interface PreguntaVerdaderoFalso extends PreguntaBase {
  tipo: TipoPregunta.VERDADERO_FALSO;
  respuesta_correcta: boolean;
}

export interface PreguntaCorrectoIncorrecto extends PreguntaBase {
  tipo: TipoPregunta.CORRECTO_INCORRECTO;
  respuesta_correcta: boolean;
}

export interface PreguntaTerminosPareados extends PreguntaBase {
  tipo: TipoPregunta.TERMINOS_PAREADOS;
  pares: Pares[];
}

export interface PreguntaCompletacion extends PreguntaBase {
  tipo: TipoPregunta.COMPLETACION;
  respuesta_correcta: string;
}

export interface PreguntaRespuestaBreve extends PreguntaBase {
  tipo: TipoPregunta.RESPUESTA_BREVE;
  respuesta_correcta: string;
}

export type Pregunta =
  | PreguntaSeleccionUnica
  | PreguntaSeleccionMultiple
  | PreguntaVerdaderoFalso
  | PreguntaCorrectoIncorrecto
  | PreguntaTerminosPareados
  | PreguntaCompletacion
  | PreguntaRespuestaBreve;

export type DatosCrearPregunta<T extends Pregunta = Pregunta> =
  T extends Pregunta
    ? Omit<
        T,
        | "_id"
        | "usuario_id"
        | "activo"
        | "fecha_creacion"
        | "fecha_actualizacion"
      >
    : never;

export type DatosActualizarPregunta<T extends Pregunta = Pregunta> =
  T extends Pregunta
    ? Partial<
        Omit<
          T,
          | "_id"
          | "usuario_id"
          | "activo"
          | "fecha_creacion"
          | "fecha_actualizacion"
        >
      >
    : never;

export type PreguntaConOpciones =
  | PreguntaSeleccionUnica
  | PreguntaSeleccionMultiple;

export type PreguntaConPares = PreguntaTerminosPareados;
