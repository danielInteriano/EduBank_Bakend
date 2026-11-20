import { Types } from "mongoose";
import type z from "zod";
import type { actualizarTemaValido } from "../validators/validar-actualizar-tema.validator.js";

export interface Tema {
  bloque_id: Types.ObjectId;
  nombre: string;
  activo: boolean;
  descripcion?: string;
  orden?: number;
}

export type DatosActualizarTema = z.infer<typeof actualizarTemaValido>;
