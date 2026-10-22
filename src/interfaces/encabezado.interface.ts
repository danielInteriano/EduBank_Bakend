import type { Types } from "mongoose";

export interface Encabezado {
  id: Types.ObjectId;
  usuario_id: Types.ObjectId;
  asignatura_id: Types.ObjectId;
  centro_educativo: string;
  parcial: string;
  valor_total: number;
  grado: string;
  seccion: number;
  activo: Boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  fecha?: Date;
  nombre_estudiante?: string;
  periodo_academico?: number;
  instrucciones?: string;
}

export type crearEncabezado = Partial<
  Pick<
    Encabezado,
    | "id"
    | "centro_educativo"
    | "parcial"
    | "grado"
    | "seccion"
    | "nombre_estudiante"
    | "periodo_academico"
    | "instrucciones"
  >
>;
