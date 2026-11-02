import type { Request, Response } from "express";
import { ManejarError } from "../classes/manejo-error.class.js";
import {
  cambiarEstado,
  modificarGrado,
  obtenerGradoPorId,
  obtenerGrados,
  registrarGrado,
} from "../services/grados.service.js";
import z from "zod";
import { catchError } from "../services/catch-error.service.js";
import { validarId } from "../utils/validar-id.js";
import type { gradoActualizado } from "../interfaces/grado.interface.js";

const crearGradoValido = z.strictObject({
  nombre: z.string().trim().min(1).max(50),
  orden: z.number().int().min(1).max(20),
});

const actualizarGradoSchema = z.strictObject({
  nombre: z.string().trim().min(1).max(50).optional(),
  orden: z.number().int().min(1).max(20).optional(),
});

//obtener un grado por su id
export const getGrado = async (req: Request, res: Response) => {
  const idGrado = req.params.id as string;
  try {
    if (!idGrado) {
      throw new ManejarError("El id de grado es obligatorio.", 400);
    }

    const grado = await obtenerGradoPorId(idGrado);

    return res.status(200).json({
      ok: true,
      grado,
    });
  } catch (error) {}
};

//obtener todos los grados
export const getGrados = async (req: Request, res: Response) => {
  const soloActivos = req.query.activos !== "false";
  try {
    const grados = await obtenerGrados(soloActivos);

    return res.status(200).json({
      ok: true,
      grados,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//crear un grado
export const crearGrado = async (req: Request, res: Response) => {
  try {
    const resultado = crearGradoValido.safeParse(req.body);

    if (!resultado.success) {
      throw new ManejarError(
        resultado.error.issues.map((issue) => issue.message).join(", "),
        400,
      );
    }

    const grado = await registrarGrado(resultado.data);

    return res.status(200).json({
      ok: true,
      msg: "Grado creado exitosamente.",
      grado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//actualizar un grado
export const actualizarGrado = async (req: Request, res: Response) => {
  const idGrado = req.params.id as string;
  try {
    const resultado = actualizarGradoSchema.safeParse(req.body);

    if (!resultado.success) {
      throw new ManejarError(
        resultado.error.issues.map((issue) => issue.message).join("; "),
        400,
      );
    }

    if (Object.keys(resultado.data).length === 0) {
      throw new ManejarError(
        "Debe proporcionar al menos un campo para actualizar",
        400,
      );
    }

    const grado = await modificarGrado(
      idGrado,
      resultado.data as gradoActualizado,
    );

    if (!grado) {
      throw new ManejarError("Grado no actualizado.", 400);
    }

    return res.status(200).json({
      ok: true,
      msg: "Grado actualizado exitosamente.",
      grado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//cambiar el estado de un grado
export const cambiarEstadoGrado = async (req: Request, res: Response) => {
  const idGrado = req.params.id as string;
  try {
    const schema = z.strictObject({
      activo: z.boolean(),
    });

    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      throw new ManejarError(
        "Debe enviar el campo activo como un valor booleano",
        400,
      );
    }

    const grado = await cambiarEstado(idGrado, resultado.data.activo);
    const mensaje = resultado.data.activo
      ? "Grado activado correctamente"
      : "Grado desactivado correctamente";

    res.status(200).json({
      ok: true,
      mensaje: mensaje,
      grado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};
