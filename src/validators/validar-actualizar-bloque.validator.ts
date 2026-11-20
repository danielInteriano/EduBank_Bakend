import { z } from "zod";

export const crearBloqueValido = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  descripcion: z.string().trim().min(1, "La descripción es obligatoria"),
});

export const actualizarBloqueValido = crearBloqueValido
  .pick({ nombre: true, descripcion: true })
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, {
    message: "Debes enviar al menos un campo para actualizar.",
  });
