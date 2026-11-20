import { type Request, type Response } from "express";
import {
  obtenerPreguntaPorId,
  obtenerPreguntasPorIds,
  crearPregunta,
  actualizar,
  eliminar,
  agregarOpcionAPregunta,
} from "../services/preguntas.service.js";
import { catchError } from "../services/catch-error.service.js";
import mongoose, { Types } from "mongoose";
import { ManejarError } from "../classes/manejo-error.class.js";
import {
  TipoPregunta,
  type Opciones,
  type Pregunta,
  type PreguntaConOpciones,
} from "../interfaces/pregunta.interface.js";

//función para obtener una pregunta
export const getPregunta = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id de la pregunta no es válido",
    });
  }

  try {
    const pregunta = obtenerPreguntaPorId(id);

    if (!pregunta) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró la pregunta con ese id.",
      });
    }

    return res.status(200).json({
      ok: true,
      pregunta,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para obtener varias preguntas
export const getPreguntasSeleccionadas = async (
  req: Request,
  res: Response,
) => {
  const ids = req.body;

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

  //Controlar el número de preguntas solicitadas
  if (ids.length > 50) {
    return res.status(400).json({
      ok: false,
      msg: "No puedes seleccionar más de 50 preguntas",
    });
  }

  try {
    const preguntas = await obtenerPreguntasPorIds(ids);
    return res.status(200).json({
      ok: true,
      total: preguntas.length,
      preguntas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para crear una pregunta
export const createPregunta = async (req: Request, res: Response) => {
  try {
    const idUsuario = req.id;

    if (!idUsuario || !Types.ObjectId.isValid(idUsuario)) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no autenticado o identificador inválido",
      });
    }
    const pregunta = await crearPregunta(req.body, idUsuario);

    return res.status(200).json({
      ok: true,
      msg: "Pregunta creada exitosamente",
      pregunta,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para actualizar una pregunta
export const actualizarPregunta = async (req: Request, res: Response) => {
  try {
    const idUsuario = req.id;
    const { idQuestion } = req.params;
    const cambios = req.body;

    //verificando el usuario autenticado
    if (!idUsuario || !Types.ObjectId.isValid(idUsuario)) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario no autenticado.",
      });
    }

    //verificando el id de la pregunta
    if (typeof idQuestion !== "string" || !idQuestion.trim()) {
      res.status(400).json({
        ok: false,
        msg: "El ID proporcionado no es válido.",
      });
      return;
    }

    if (!idQuestion || !Types.ObjectId.isValid(idQuestion)) {
      return res.status(400).json({
        ok: false,
        msg: "El identificador de la pregunta no es válido.",
      });
    }

    const pregunta = await actualizar(idQuestion, idUsuario, cambios);

    return res.status(200).json({
      ok: true,
      msg: "Pregunta actualizada correctamente",
      pregunta,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para eliminar una pregunta
export const eliminarPregunta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idUsuario = req.id;

    if (typeof id !== "string" || !id.trim()) {
      throw new ManejarError(
        "El identificador de la pregunta es obligatorio o no es válido",
        400,
      );
    }

    if (!idUsuario) {
      throw new ManejarError("Usuario no autenticado.", 401);
    }

    const pregunta = await eliminar(id, idUsuario);

    return res.status(200).json({
      ok: true,
      msg: "La pregunta cambió su estado a inactivo.",
      pregunta,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

//función para agregar una opción a una pregunta de selección única o múltiple
export const agregarOpcion = async (
  req: Request<{ idPregunta: string }, {}, Opciones>,
  res: Response,
) => {
  try {
    const { idPregunta } = req.params;
    const idUsuario = req.id;

    if (
      typeof idPregunta !== "string" ||
      !idPregunta.trim() ||
      !Types.ObjectId.isValid(idPregunta)
    ) {
      throw new ManejarError("ID de pregunta no válido", 400);
    }

    if (
      typeof idUsuario !== "string" ||
      !idUsuario.trim() ||
      !Types.ObjectId.isValid(idUsuario)
    ) {
      throw new ManejarError("ID de usuario no válido", 400);
    }

    const pregunta = await agregarOpcionAPregunta(
      idPregunta,
      idUsuario,
      req.body,
    );

    if (!pregunta) {
      throw new ManejarError(
        "Pregunta no encontrada o no permite opciones",
        400,
      );
    }

    if (!preguntaTieneOpciones(pregunta)) {
      throw new ManejarError("La pregunta no permite opciones", 400);
    }

    return res.status(200).json({
      ok: true,
      msg: "Opción agregada exitosamente",
      totalOpciones: pregunta.opciones?.length ?? 0,
      pregunta,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(catchError());
  }
};

const preguntaTieneOpciones = (
  pregunta: Pregunta,
): pregunta is PreguntaConOpciones => {
  return (
    pregunta.tipo === TipoPregunta.SELECCION_UNICA ||
    pregunta.tipo === TipoPregunta.SELECCION_MULTIPLE
  );
};
