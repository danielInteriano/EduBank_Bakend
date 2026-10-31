import type { Types } from "mongoose";

export type TipoArchivo = "pregunta" | "logo" | "predeterminada";
export type TipoEntidad = "pregunta" | "encabezado" | "usuario";

export interface Archivo {
  usuario_id: Types.ObjectId;
  tipo: TipoArchivo;
  nombre_original: string;
  nombre_archivo: string;
  ruta: string;
  url: string;
  mime_tipo: string;
  extension: string;
  tamanio: number;
  entidad_id?: Types.ObjectId;
  entidad_tipo?: TipoEntidad;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface ArchivoDB {
  tipo: TipoArchivo;
  entidad_id?: string;
  entidad_tipo?: TipoEntidad;
}
