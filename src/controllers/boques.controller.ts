import { type Request, type Response } from "express";
import BBloque from "../models/bloque.model.js";
import { catchError } from "../services/catch-error.service.js";
import {
  obtenerBloquePorId,
  obtenerBloques,
  contarBloques,
  obtenerBloquePorNombre,
  actualizandoCamposBloque,
  eliminar,
} from "../services/bloques.service.js";
import mongoose from "mongoose";
import { obtenerAsignaturaPorId } from "../services/asignaturas.service.js";

//función para obtener un bloque
export const getBloque = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del bloque no es válido",
    });
  }

  try {
    const bloque = obtenerBloquePorId(id);
    if (!bloque) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el bloque con ese id.",
      });
    }

    return res.status(200).json({
      ok: true,
      bloque,
    });
  } catch (error) {
    catchError();
  }
};

//función para obtener todos los bloques
export const getBloques = async (req: Request, res: Response) => {
  try {
    const [bloques, totalBloques] = await Promise.all([
      obtenerBloques(),
      contarBloques(),
    ]);

    return res.status(200).json({
      ok: true,
      bloques,
      totalBloques,
    });
  } catch (error) {
    catchError();
  }
};

//función para crear un bloque
export const crearBloque = async (req: Request, res: Response) => {
  const { idAsignatura, nombre } = req.body;

  if (typeof nombre !== "string" || !nombre.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre del bloque no es válido.",
    });
  }

  if (
    typeof idAsignatura !== "string" ||
    !mongoose.isValidObjectId(idAsignatura)
  ) {
    return res.status(400).json({
      ok: false,
      msg: "El id de la asignatura no es válido.",
    });
  }

  try {
    const asignaturaExiste = await obtenerAsignaturaPorId(idAsignatura);
    const bloqueExiste = await obtenerBloquePorNombre(nombre);

    if (!asignaturaExiste) {
      return res.status(400).json({
        of: false,
        msg: "Debe agregar el bloque a una asignatura válida.",
      });
    }

    if (bloqueExiste) {
      return res.status(400).json({
        of: false,
        msg: "Ya existe un bloque con ese nombre.",
      });
    }

    const bloque = new BBloque(req.body);
    await bloque.save();
  } catch (error) {
    catchError();
  }
};

//función para actualizar un bloque
export const actualizarBloque = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del bloque no es válido",
    });
  }

  try {
    const bloqueDB = await obtenerBloquePorId(id);

    if (!bloqueDB) {
      return res.status(404).json({
        ok: false,
        msg: `El bloque no está registrado.`,
      });
    }

    //si el bloque está, entonces se actualiza.
    const { nombre, descripcion, ...campos } = req.body;

    if (bloqueDB.nombre !== nombre) {
      const bloqueRegistrado = await obtenerBloquePorNombre(nombre);
      if (bloqueRegistrado) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un bloque con ese nombre.",
        });
      }
    }

    //Actualizando los campos del bloque
    const bloqueActualizado = await actualizandoCamposBloque(
      id,
      nombre,
      descripcion,
    );

    res.status(200).json({
      ok: true,
      usuario: bloqueActualizado,
    });
  } catch (error) {
    catchError();
  }
};

//función para eliminar un bloque
export const eliminarBloque = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del bloque no es válido.",
    });
  }

  try {
    const encontrado = await obtenerBloquePorId(id);

    if (!encontrado) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el bloque.",
      });
    }

    //Si el bloque existe, se cambia su estado "activo" a false
    await eliminar(id);
    return res.status(200).json({
      ok: true,
      msg: "Bloque eliminado exitosamente.",
    });
  } catch (error) {
    catchError();
  }
};
