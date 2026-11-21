import { type Request, type Response } from "express";
import { ManejarError } from "../classes/manejo-error.class.js";
import {
  actualizarCampos,
  createEncabezado,
  eliminar,
  obtenerEncabezado,
} from "../services/encabezados.service.js";
import { catchError } from "../services/catch-error.service.js";
import EncabezadoExamen from "../models/encabezado.model.js";
import { validarId } from "../utils/validar-id.js";
import { Types } from "mongoose";

//función para obtener un encabezado
export const getEncabezado = async (req: Request, res: Response) => {
  try {
    const idEncabezado = req.params.id;
    const idUsuario = req.id;

    if (!idUsuario || !Types.ObjectId.isValid(idUsuario)) {
      throw new ManejarError("Usuario no autenticado", 401);
    }

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
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para crear un encabezado
export const crearEncabezado = async (req: Request, res: Response) => {
  try {
    const idUsuario = req.id;

    if (!idUsuario || !Types.ObjectId.isValid(idUsuario)) {
      throw new ManejarError("Usuario no autenticado", 401);
    }

    const encabezado = await createEncabezado(req.body, idUsuario);

    if (!encabezado) {
      throw new ManejarError("No se pudo crear el encabezado", 500);
    }

    res.status(200).json({
      ok: true,
      msg: "Encabezado creado exitosamente.",
      encabezado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para actualizar campos del encabezado
export const actualizarEncabezado = async (req: Request, res: Response) => {
  try {
    const idEncabezado = req.params.id;
    const idUsuario = req.id;

    if (!idUsuario || !Types.ObjectId.isValid(idUsuario)) {
      throw new ManejarError("Usuario no autenticado", 401);
    }

    if (typeof idEncabezado !== "string" || !idEncabezado.trim()) {
      return res.status(400).json({
        ok: false,
        msg: "El id del encabezado no es válido",
      });
    }

    const encabezado = await actualizarCampos(
      req.body,
      idEncabezado,
      idUsuario,
    );

    return res.status(200).json({
      ok: true,
      msg: "Encabezado actualizado exitosamente",
      encabezado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para eliminar un encabezado cambiando su estado activo a "false"
export const eliminarEncabezado = async (req: Request, res: Response) => {
  try {
    const idEncabezado = req.params.id as string;
    const idUsuario = req.id;

    if (!idUsuario || !Types.ObjectId.isValid(idUsuario)) {
      throw new ManejarError("Usuario no autenticado", 401);
    }

    if (!idEncabezado || !Types.ObjectId.isValid(idEncabezado)) {
      throw new ManejarError("El id del encabezado no es válido", 400);
    }

    const encabezadoEliminado = await eliminar(idEncabezado);

    res.status(200).json({
      ok: true,
      msg: "Encabezado eliminado exitosamente",
      encabezado: encabezadoEliminado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};
