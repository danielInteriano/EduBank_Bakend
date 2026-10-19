import { type Request, type Response } from "express";
import {
  obtenerPreguntaPorId,
  obtenerPreguntasPorIds,
  crear,
  actualizar,
  eliminar,
} from "../services/preguntas.service.js";
import { catchError } from "../services/catch-error.service.js";
import mongoose, { Types } from "mongoose";
import {
  TipoPregunta,
  type crearQuestion,
} from "../interfaces/pregunta.interface.js";
import { ManejarError } from "../classes/manejo-error.class.js";

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
    catchError();
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
    catchError();
  }
};

//función para crear una pregunta
export const crearPregunta = async (req: Request, res: Response) => {
  try {
    const usuario_id = req.id;

    if (!usuario_id || !Types.ObjectId.isValid(usuario_id)) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no autenticado o identificador inválido",
      });
    }

    const {
      asignatura_id,
      bloque_id,
      tema_id,
      tipo,
      enunciado,
      respuesta_correcta,
      opciones,
      pares,
      puntuacion,
      imagen_url,
      explicacion,
      dificultad,
    } = req.body;

    if (!asignatura_id || bloque_id || tema_id) {
      return res.status(400).json({
        ok: false,
        msg: "La asignatura, el bloque y el tema son obligatorios",
      });
    }

    if (
      !Types.ObjectId.isValid(asignatura_id) ||
      !Types.ObjectId.isValid(bloque_id) ||
      !Types.ObjectId.isValid(tema_id)
    ) {
      return res.status(400).json({
        ok: false,
        msg: "Uno o más identificadores no son válidos.",
      });
    }

    if (!Object.values(TipoPregunta).includes(tipo as TipoPregunta)) {
      return res.status(400).json({
        ok: false,
        msg: "El tipo de pregunta es obligatorio.",
      });
    }

    if (typeof enunciado !== "string" || !enunciado.trim()) {
      return res.status(400).json({
        ok: false,
        msg: "El enunciado es obligatorio.",
      });
    }

    if (
      typeof puntuacion !== "number" ||
      !Number.isFinite(puntuacion) ||
      puntuacion <= 0
    ) {
      return res.status(400).json({
        ok: false,
        msg: "La puntuación debe ser un número mayor que cero.",
      });
    }

    //datos del servicio para crear la pregunta
    const datosPregunta: crearQuestion = {
      asignatura_id,
      bloque_id,
      tema_id,
      tipo: tipo as TipoPregunta,
      enunciado: enunciado.trim(),
      ...(respuesta_correcta !== undefined && { respuesta_correcta }),
      ...(opciones !== undefined && { opciones }),
      ...(pares !== undefined && { pares }),
      puntuacion,
      ...(imagen_url !== undefined && { imagen_url }),
      ...(explicacion !== undefined && { explicacion }),
      ...(dificultad !== undefined && { dificultad }),
    };

    const pregunta = await crear(datosPregunta, usuario_id);

    return res.status(200).json({
      ok: true,
      msg: "Pregunta creada exitosamente",
      pregunta,
    });
  } catch (error) {
    catchError();
  }
};

//función para actualizar una pregunta
export const actualizarPregunta = async (req: Request, res: Response) => {
  try {
    const idUsuario = req.id;
    const { idQuestion } = req.params;

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

    //verificando los datos del body
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        ok: false,
        msg: "Los datos de actualización no son válidos.",
      });
    }

    //campos que se pueden modificar de cada pregunta
    const camposPermitidos = [
      "asignatura_id",
      "bloque_id",
      "tema_id",
      "tipo",
      "enunciado",
      "respuesta_correcta",
      "opciones",
      "pares",
      "puntuacion",
      "imagen_url",
      "explicacion",
      "dificultad",
    ];

    //guardando en cambios todos los campos que no son undefined
    const cambios = Object.fromEntries(
      Object.entries(req.body).filter(
        ([campo, valor]) =>
          camposPermitidos.includes(campo) && valor !== undefined,
      ),
    );

    //validando si en cambios hay campos que modificar de la pregunta
    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No se recibieron campos válidos para actualizar.",
      });
    }

    const pregunta = await actualizar(idQuestion, idUsuario, cambios);

    return res.status(200).json({
      ok: true,
      msg: "Pregunta actualizada correctamente",
      pregunta,
    });
  } catch (error) {
    catchError();
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
    catchError();
  }
};
