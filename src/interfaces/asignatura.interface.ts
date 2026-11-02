import z, { string } from "zod";
import type { actualizarAsignaturaValido } from "../validators/validar_actualizar_asignatura.validator.js";

export interface Asignatura {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export type DatosActualizarAsignatura = z.infer<
  typeof actualizarAsignaturaValido
>;
