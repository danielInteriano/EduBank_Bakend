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
  obtenerTemasPorBloque,
} from "../services/bloques.service.js";
import mongoose from "mongoose";
import { obtenerAsignaturaPorId } from "../services/asignaturas.service.js";
import { actualizarBloqueValido } from "../validators/validar-actualizar-bloque.validator.js";

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
    const bloque = await obtenerBloquePorId(id);

    if (!bloque) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el bloque.",
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

//funcion para obtener todos los temas de un bloque
export const getTemasPorBloque = async (req: Request, res: Response) => {
  try {
    const idBloque = req.params.idBloque;

    //validando el id del bloque recibido
    if (typeof idBloque !== "string" || !idBloque.trim()) {
      return res.status(401).json({
        ok: false,
        msg: "El id del bloque no es válido.",
      });
    }

    const temas = await obtenerTemasPorBloque(idBloque);

    return res.status(200).json({
      ok: true,
      totalTemas: temas.length,
      temas,
    });
  } catch (error) {
    catchError();
  }
};
//función para crear un bloque
export const crearBloque = async (req: Request, res: Response) => {
  const { asignatura_id, nombre } = req.body;

  if (typeof nombre !== "string" || !nombre.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre del bloque no es válido.",
    });
  }

  if (
    typeof asignatura_id !== "string" ||
    !mongoose.isValidObjectId(asignatura_id)
  ) {
    return res.status(400).json({
      ok: false,
      msg: "El id de la asignatura no es válido.",
    });
  }

  try {
    const asignaturaExiste = await obtenerAsignaturaPorId(asignatura_id);
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

    const bloque = await BBloque.create(req.body);

    return res.status(200).json({
      ok: true,
      msg: "Bloque creado exitosamente.",
      bloque,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para actualizar un bloque
export const actualizarBloque = async (req: Request, res: Response) => {
  const idBloque = req.params.id as string;

  if (typeof idBloque !== "string" || !idBloque.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del bloque no es válido",
    });
  }

  try {
    const bloqueDB = await obtenerBloquePorId(idBloque);

    if (!bloqueDB) {
      return res.status(404).json({
        ok: false,
        msg: `El bloque no está registrado.`,
      });
    }

    //validando los campos para actualizar
    const resultado = actualizarBloqueValido.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        ok: false,
        errores: resultado.error.issues,
      });
    }

    //Actualizando los campos del bloque
    const bloqueActualizado = await actualizandoCamposBloque(
      idBloque,
      resultado.data,
    );

    return res.status(200).json({
      ok: true,
      msg: "Bloque actualizado exitosamente.",
      usuario: bloqueActualizado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para eliminar un bloque
export const eliminarBloque = async (req: Request, res: Response) => {
  const idBloque = req.params.id;

  if (typeof idBloque !== "string" || !idBloque.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del bloque no es válido.",
    });
  }

  try {
    const encontrado = await obtenerBloquePorId(idBloque);

    if (!encontrado) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el bloque.",
      });
    }

    //Si el bloque existe, se cambia su estado "activo" a false
    const bloqueEliminado = await eliminar(idBloque);

    return res.status(200).json({
      ok: true,
      msg: "Bloque eliminado exitosamente.",
      bloque: bloqueEliminado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};
