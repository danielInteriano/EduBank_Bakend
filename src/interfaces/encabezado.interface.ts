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
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  fecha?: Date;
  nombre_estudiante?: string;
  periodo_academico?: number;
  instrucciones?: string;
}

export type DatosCrearEncabezado = Pick<Encabezado, "asignatura_id"> &
  Partial<
    Pick<
      Encabezado,
      | "centro_educativo"
      | "parcial"
      | "valor_total"
      | "grado"
      | "seccion"
      | "nombre_estudiante"
      | "periodo_academico"
      | "instrucciones"
      | "fecha"
    >
  >;

export type DatosActualizarEncabezado = Partial<
  Pick<
    Encabezado,
    | "centro_educativo"
    | "parcial"
    | "valor_total"
    | "grado"
    | "seccion"
    | "fecha"
    | "nombre_estudiante"
    | "periodo_academico"
    | "instrucciones"
  >
>;
