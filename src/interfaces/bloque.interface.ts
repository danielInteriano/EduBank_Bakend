import { Types } from "mongoose";
import type { actualizarBloqueValido } from "../validators/validar-actualizar-bloque.validator.js";
import type z from "zod";

export interface Bloque {
  asignatura_id: Types.ObjectId;
  nombre: string;
  activo: boolean;
  descripcion?: string;
  orden?: number;
}

export type DatosActualizarBloque = z.infer<typeof actualizarBloqueValido>;
