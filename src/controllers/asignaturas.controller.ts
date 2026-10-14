import { type Request, type Response } from "express";
import Signature from "../models/asignatura.model.js";
import {
  obtenerAsignaturaPorId,
  obtenerAsignaturas,
  contarAsignaturas,
  obtenerAsignaturasPorIds,
  obtenerAsignaturaPorNombre,
  actualizandoCamposAsignatura,
  eliminar,
} from "../services/asignaturas.service.js";
import { catchError } from "../services/catch-error.service.js";
import mongoose from "mongoose";

//función para obtener una asignatura
export const getAsignatura = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id de la asignatura no es válido",
    });
  }

  try {
    const asignatura = obtenerAsignaturaPorId(id);
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
  if (ids.length > 10) {
    return res.status(400).json({
      ok: false,
      msg: "No puedes seleccionar más de 20 asignaturas",
    });
  }

  try {
    const asignaturas = await obtenerAsignaturasPorIds(ids);
    return res.status(200).json({
      ok: true,
      total: asignaturas.length,
      asignaturas,
    });
  } catch (error) {
    catchError();
  }
};

//función para crear una asignatura
export const crearAsignatura = async (req: Request, res: Response) => {
  const { nombre } = req.body;

  if (typeof nombre !== "string" || !nombre.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre de la asignatura no es válido.",
    });
  }

  try {
    const asignaturaExiste = await obtenerAsignaturaPorNombre(nombre);

    if (asignaturaExiste) {
      return res.status(400).json({
        of: false,
        msg: "Ya existe una asignatura con ese nombre.",
      });
    }

    const asignatura = new Signature(req.body);
    await asignatura.save();

    return res.status(200).json({
      ok: true,
      asignatura,
    });
  } catch (error) {
    catchError();
  }
};

//función para actualizar una asignatura
export const actualizarAsignatura = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id de la asignatura no es válido",
    });
  }

  try {
    const asignaturaDB = await obtenerAsignaturaPorId(id);

    if (!asignaturaDB) {
      return res.status(404).json({
        ok: false,
        msg: `La asignatura no esta registrada.`,
      });
    }

    //si la asignatura esta, entonces se actualiza.
    const { nombre, descripcion, ...campos } = req.body;

    if (asignaturaDB.nombre !== nombre) {
      const asignaturaRegistrada = await obtenerAsignaturaPorNombre(nombre);
      if (asignaturaRegistrada) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe una asignatura con ese nombre.",
        });
      }
    }

    //Actualizando los campos de la asignatura
    const asignaturaActualizada = await actualizandoCamposAsignatura(
      id,
      nombre,
      descripcion,
    );

    res.status(200).json({
      ok: true,
      usuario: asignaturaActualizada,
    });
  } catch (error) {
    catchError();
  }
};

//función para eliminar una asignatura
export const eliminarAsignatura = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id de la asignatura no es válido",
    });
  }

  try {
    const encontrado = await obtenerAsignaturaPorId(id);

    if (!encontrado) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro la asignatura.",
      });
    }

    //Si la asignatura existe, se cambia su estado "activo" a false
    await eliminar(id);
    return res.status(200).json({
      ok: true,
      msg: "Asignatura eliminada exitosamente.",
    });
  } catch (error) {
    catchError();
  }
};
