import { type Request, type Response } from "express";
import { catchError } from "../services/catch-error.service.js";
import { obtenerBloquePorId } from "../services/bloques.service.js";
import mongoose, { Types } from "mongoose";
import {
  actualizandoCamposTema,
  contarTemas,
  obtenerTemaPorId,
  obtenerTemaPorNombre,
  obtenerTemas,
  eliminar,
  obtenerPreguntasPorTema,
} from "../services/temas.service.js";
import TTema from "../models/tema.model.js";
import { actualizarTemaValido } from "../validators/validar-actualizar-tema.validator.js";

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
    const tema = await obtenerTemaPorId(id);

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

//función para obtener todas las preguntas de un tema
export const getPreguntasPorTema = async (req: Request, res: Response) => {
  try {
    const idTema = req.params.idTema;

    //validando el id del bloque recibido
    if (typeof idTema !== "string" || !idTema.trim()) {
      return res.status(401).json({
        ok: false,
        msg: "El id del bloque no es válido.",
      });
    }

    const preguntas = await obtenerPreguntasPorTema(idTema);

    return res.status(200).json({
      ok: true,
      totalPreguntas: preguntas?.length ?? 0,
      preguntas,
    });
  } catch (error) {
    catchError();
  }
};

//función para crear un bloque
export const crearTema = async (req: Request, res: Response) => {
  const { bloque_id, nombre } = req.body;

  if (typeof nombre !== "string" || !nombre.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre del tema no es válido.",
    });
  }

  if (typeof bloque_id !== "string" || !Types.ObjectId.isValid(bloque_id)) {
    return res.status(400).json({
      ok: false,
      msg: "El id del bloque no es válido.",
    });
  }

  try {
    const bloqueExiste = await obtenerBloquePorId(bloque_id);
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

    const tema = await TTema.create(req.body);

    return res.status(200).json({
      ok: true,
      msg: "Tema creado exitosamente.",
      tema,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para actualizar un bloque
export const actualizarTema = async (req: Request, res: Response) => {
  const idTema = req.params.id;

  if (typeof idTema !== "string" || !idTema.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del tema no es válido",
    });
  }

  try {
    const temaDB = await obtenerTemaPorId(idTema);

    if (!temaDB) {
      return res.status(404).json({
        ok: false,
        msg: `El tema no está registrado.`,
      });
    }

    //validando los campos para actualizar
    const resultado = actualizarTemaValido.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        ok: false,
        errores: resultado.error.issues,
      });
    }

    //Actualizando los campos del tema
    const temaActualizado = await actualizandoCamposTema(
      idTema,
      resultado.data,
    );

    res.status(200).json({
      ok: true,
      msg: "Tema actualizado exitosamente.",
      tema: temaActualizado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para eliminar un tema
export const eliminarTema = async (req: Request, res: Response) => {
  const idTema = req.params.id;

  if (typeof idTema !== "string" || !idTema.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del tema no es válido.",
    });
  }

  try {
    const encontrado = await obtenerTemaPorId(idTema);

    if (!encontrado) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el tema.",
      });
    }

    //Si el tema existe, se cambia su estado "activo" a false
    const temaEliminado = await eliminar(idTema);

    return res.status(200).json({
      ok: true,
      msg: "Tema eliminado exitosamente.",
      tema: temaEliminado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};
