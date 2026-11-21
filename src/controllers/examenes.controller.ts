import { ManejarError } from "../classes/manejo-error.class.js";
import type { Request, Response } from "express";
import {
  actualizarExam,
  createExamen,
  deleteExamen,
  ObtenerExamenes,
  ObtenerExamenPorId,
} from "../services/examenes.service.js";
import { catchError } from "../services/catch-error.service.js";

//función para obtener un examen por su id
export const getExamen = async (req: Request, res: Response) => {
  try {
    const idExamen = req.params.id;

    if (!req.id) {
      throw new ManejarError("El id del usuario es obligatorio", 400);
    }

    if (typeof idExamen !== "string") {
      throw new ManejarError("El id del examen no es válido.", 400);
    }

    const examen = await ObtenerExamenPorId(idExamen, req.id);

    return res.status(200).json({
      ok: true,
      examen,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para obtener todos los examenes
export const getExamenes = async (req: Request, res: Response) => {
  const idUsuario = req.id as string;
  try {
    const examenes = await ObtenerExamenes(idUsuario);

    return res.status(200).json({
      ok: true,
      examenes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para crear un examen
export const crearExamen = async (req: Request, res: Response) => {
  try {
    const idUsuario = req.id;

    if (typeof idUsuario !== "string" || !idUsuario.trim()) {
      throw new ManejarError("El id del usuario es obligatorio", 401);
    }

    const examen = await createExamen(idUsuario, req.body);

    return res.status(200).json({
      ok: true,
      msg: "El examen se ha creado exitosamente.",
      examen,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para actualizar un examen
export const actualizarExamen = async (req: Request, res: Response) => {
  const idExamen = req.params.id;
  const idUsuario = req.id;

  if (typeof idUsuario !== "string" || !idUsuario.trim()) {
    throw new ManejarError("El id de usuario es obligatorio", 400);
  }

  if (typeof idExamen !== "string" || !idExamen.trim()) {
    throw new ManejarError("El id del examen es obligatorio", 400);
  }

  const examen = await actualizarExam(idUsuario, idExamen, req.body);

  if (!examen) {
    throw new ManejarError("El examen no pudo actualizarse", 404);
  }

  return res.status(200).json({
    ok: true,
    msg: "El examen de actualizó exitosamente.",
    examen,
  });
};

//función para eliminar un examen
export const eliminarExamen = async (req: Request, res: Response) => {
  const idExamen = req.params.id as string;
  const idUsuario = req.id;
  try {
    if (typeof idExamen !== "string" || !idExamen.trim()) {
      throw new ManejarError("El id del examen es obligatorio", 400);
    }

    if (typeof idUsuario !== "string" || !idUsuario.trim()) {
      throw new ManejarError("El id del usuario es obligatorio.", 400);
    }

    const examen = await deleteExamen(idExamen, idUsuario);

    if (!examen) {
      throw new ManejarError("No se encontró nada que eliminar.", 404);
    }

    return res.status(200).json({
      ok: true,
      msg: "Examen eliminado exitosamente.",
      examen,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};
