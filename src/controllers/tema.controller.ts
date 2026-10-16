import { type Request, type Response } from "express";
import { catchError } from "../services/catch-error.service.js";
import { obtenerBloquePorId } from "../services/bloques.service.js";
import mongoose from "mongoose";
import {
  actualizandoCamposTema,
  contarTemas,
  obtenerTemaPorId,
  obtenerTemaPorNombre,
  obtenerTemas,
  eliminar,
} from "../services/temas.service.js";
import TTema from "../models/tema.model.js";

//función para obtener un tema
export const getTema = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del tema no es válido",
    });
  }

  try {
    const tema = obtenerTemaPorId(id);
    if (!tema) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el tema con ese id.",
      });
    }

    return res.status(200).json({
      ok: true,
      tema,
    });
  } catch (error) {
    catchError();
  }
};

//función para obtener todos los temas
export const getTemas = async (req: Request, res: Response) => {
  try {
    const [temas, totalTemas] = await Promise.all([
      obtenerTemas(),
      contarTemas(),
    ]);

    return res.status(200).json({
      ok: true,
      temas,
      totalTemas,
    });
  } catch (error) {
    catchError();
  }
};

//función para crear un bloque
export const crearTema = async (req: Request, res: Response) => {
  const { idBloque, nombre } = req.body;

  if (typeof nombre !== "string" || !nombre.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre del tema no es válido.",
    });
  }

  if (typeof idBloque !== "string" || !mongoose.isValidObjectId(idBloque)) {
    return res.status(400).json({
      ok: false,
      msg: "El id del bloque no es válido.",
    });
  }

  try {
    const bloqueExiste = await obtenerBloquePorId(idBloque);
    const temaExiste = await obtenerTemaPorNombre(nombre);

    if (!bloqueExiste) {
      return res.status(400).json({
        of: false,
        msg: "Debe agregar el bloque para agregar el tema.",
      });
    }

    if (temaExiste) {
      return res.status(400).json({
        of: false,
        msg: "Ya existe un tema con ese nombre.",
      });
    }

    const tema = new TTema(req.body);
    await tema.save();
  } catch (error) {
    catchError();
  }
};

//función para actualizar un bloque
export const actualizarTema = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del tema no es válido",
    });
  }

  try {
    const temaDB = await obtenerTemaPorId(id);

    if (!temaDB) {
      return res.status(404).json({
        ok: false,
        msg: `El tema no está registrado.`,
      });
    }

    //si el tema está, entonces se actualiza.
    const { nombre, descripcion, ...campos } = req.body;

    if (temaDB.nombre !== nombre) {
      const temaRegistrado = await obtenerTemaPorNombre(nombre);
      if (temaRegistrado) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un tema con ese nombre.",
        });
      }
    }

    //Actualizando los campos del tema
    const temaActualizado = await actualizandoCamposTema(
      id,
      nombre,
      descripcion,
    );

    res.status(200).json({
      ok: true,
      usuario: temaActualizado,
    });
  } catch (error) {
    catchError();
  }
};

//función para eliminar un tema
export const eliminarTema = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del tema no es válido.",
    });
  }

  try {
    const encontrado = await obtenerTemaPorId(id);

    if (!encontrado) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el tema.",
      });
    }

    //Si el tema existe, se cambia su estado "activo" a false
    await eliminar(id);
    return res.status(200).json({
      ok: true,
      msg: "Tema eliminado exitosamente.",
    });
  } catch (error) {
    catchError();
  }
};
