import { type Request, type Response } from "express";
import Signature from "../models/asignatura.js";
import {
  obtenerAsignatura,
  obtenerAsignaturas,
  contarAsignaturas,
} from "../services/asignaturas.service.js";
import { catchError } from "../services/catch-error.service.js";
import mongoose from "mongoose";

//función para obtener una pregunta
export const getAsignatura = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id de la asignatura no es válido",
    });
  }

  try {
    const asignatura = obtenerAsignatura(id);
    if (!asignatura) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el asignatura con ese id.",
      });
    }

    return res.status(200).json({
      ok: true,
      asignatura,
    });
  } catch (error) {}
};

//función para obtener todas las asignaturas
export const getAsignaturas = async (req: Request, res: Response) => {
  const desde = Number(req.params.desde ?? 0);

  if (!Number.isInteger(desde) || desde < 0) {
    return res.status(400).json({
      ok: false,
      msg: "El parámetro <desde> debe ser mayor o igual que 0.",
    });
  }

  try {
    const [asignaturas, totalAsignaturas] = await Promise.all([
      obtenerAsignaturas(desde),
      contarAsignaturas(),
    ]);

    return res.status(200).json({
      ok: true,
      asignaturas,
      totalAsignaturas,
    });
  } catch (error) {
    res.status(200).json(catchError());
  }
};

//función para obtener las asignaturas seleccionadas
export const getAsignaturasSeleccionadas = async (
  req: Request,
  res: Response,
) => {
  const { ids } = req.body;

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.some(
      (id: unknown) => typeof id !== "string" || !mongoose.isValidObjectId(id),
    )
  ) {
    return res.status(400).json({
      ok: false,
      msg: "Debes enviar un arreglo de IDs válidos",
    });
  }

  //Controlar el numero de asignaturas solicitadas
  if (ids.length > 20) {
    return res.status(400).json({
      ok: false,
      msg: "No puedes seleccionar más de 20 asignaturas",
    });
  }
};
