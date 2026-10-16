import { Types } from "mongoose";

export interface Tema {
  bloque_id: Types.ObjectId;
  nombre: string;
  activo: boolean;
  descripcion?: string;
  orden?: number;
}
