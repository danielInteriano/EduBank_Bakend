import { Types } from "mongoose";

export enum Estado {
  BORRADOR = "borrador",
  GENERADO = "generado",
  APLICADO = "aplicado",
  ARCHIVADO = "archivado",
}

export interface PreguntaSeleccionada {
  pregunta_id: string;
  orden: number;
}

export interface Examen {
  usuario_id: Types.ObjectId;
  encabezado_id: Types.ObjectId;
  titulo: string;
  estado: Estado;
  cantidad_preguntas: number;
  puntuacion_total: number;
  descripcion?: string;
  pdf_url?: string;
  fecha_generacion?: Date;
}

export interface ExamenPregunta {
  examen_id: Types.ObjectId;
  pregunta_id: Types.ObjectId;
  numero: number;
  puntuacion: number;
  orden: number;
}

export interface datosExamenCrear {
  encabezado_id: string;
  titulo: string;
  descripcion: string;
  preguntas: PreguntaSeleccionada[];
}

export interface datosExamenActualizar {
  encabezado_id?: string;
  titulo?: string;
  descripcion?: string;
  preguntas?: PreguntaSeleccionada[];
}
