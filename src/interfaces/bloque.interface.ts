import { Types } from "mongoose";

export interface Bloque {
  asignatura_id: Types.ObjectId;
  nombre: string;
  activo: boolean;
  descripcion?: string;
  orden?: number;
}
