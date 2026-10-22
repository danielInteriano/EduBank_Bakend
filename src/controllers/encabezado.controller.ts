import { type Request, type Response } from "express";
import { ManejarError } from "../classes/manejo-error.class.js";
import {
  actualizarCampos,
  obtenerEncabezado,
} from "../services/encabezados.service.js";
import { catchError } from "../services/catch-error.service.js";
import EncabezadoExamen from "../models/encabezado.model.js";

//función para obtener un encabezado
export const getEncabezado = async (req: Request, res: Response) => {
  try {
    const idEncabezado = req.params.id;

    if (typeof idEncabezado !== "string" || !idEncabezado.trim()) {
      throw new ManejarError("El id de la asignatura no es valido", 401);
    }

    const encabezado = await obtenerEncabezado(idEncabezado);

    if (!encabezado) {
      throw new ManejarError("No se encontró el encabezado", 404);
    }

    res.status(200).json({
      ok: true,
      encabezado,
    });
  } catch (error) {
    catchError();
  }
};

//función para crear un encabezado
export const crearEncabezado = async (req: Request, res: Response) => {
  try {
    const idEncabezado = req.body.id;

    if (!idEncabezado) {
      throw new ManejarError("El id del encabezado es obligatorio.", 401);
    }

    const encabezadoExiste = await obtenerEncabezado(idEncabezado);

    if (!encabezadoExiste) {
      throw new ManejarError("No existe el encabezado con ese id.", 404);
    }

    const encabezado = new EncabezadoExamen(req.body);
    await encabezado.save();

    res.status(200).json({
      ok: true,
      msg: "Encabezado creado exitosamente.",
      encabezado,
    });
  } catch (error) {
    catchError();
  }
};

//función para actualizar campos del encabezado
export const actualizarEncabezado = async (req: Request, res: Response) => {
  try {
    const idEncabezado = req.params.idEncabezado;

    if (typeof idEncabezado !== "string" || !idEncabezado.trim()) {
      return res.status(400).json({
        ok: false,
        msg: "El id del encabezado no es válido",
      });
    }

    const encabezadoDB = await obtenerEncabezado(idEncabezado);

    if (!encabezadoDB) {
      throw new ManejarError("El encabezado no existe.", 404);
    }

    const {
      usuario_id,
      asignatura_id,
      fecha_creacion,
      fecha_actualizacion,
      fecha,
      activo,
      valor_total,
      ...campos
    } = req.body;

    const encabezadoActualizado = await actualizarCampos(campos);

    return res.status(200).json({
      ok: true,
      msg: "Encabezado actualizado exitosamente",
      encabezadoActualizado,
    });
  } catch (error) {
    catchError();
  }
};
