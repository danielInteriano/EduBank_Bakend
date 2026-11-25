import type { ClientSession, Types } from "mongoose";
import {
  Estado,
  type DatosActualizarExamen,
  type DatosCrearExamen,
  type Examen,
} from "../interfaces/examen.interface.js";
import ExamenQuestion from "../models/examen-pregunta.model.js";
import Exam from "../models/examen.model.js";
import { validarId } from "../utils/validar-id.js";
import { ManejarError } from "../classes/manejo-error.class.js";
import { catchError } from "./catch-error.service.js";
import EncabezadoExamen from "../models/encabezado.model.js";
import {
  obtenerPreguntasValidas,
  validarPreguntas,
} from "./preguntas.service.js";
import mongoose, { Mongoose } from "mongoose";

//obtener el listado de examenes
export const ObtenerExamenes = async (idUsuario: string) => {
  const usuarioId = validarId(idUsuario);

  return Exam.find({
    usuario_id: usuarioId,
    estado: { $ne: Estado.ARCHIVADO },
  }).sort({ createdAt: -1 });
};

//obtener un examen por su id
export const ObtenerExamenPorId = async (
  idExamen: string,
  idUsuario: string,
) => {
  const examenId = validarId(idExamen);
  const usuarioId = validarId(idUsuario);

  const examen = await Exam.findOne({
    _id: examenId,
    usuario_id: usuarioId,
  }).populate("encabezado_id");

  if (!examen) {
    throw new ManejarError("Examen no encontrado.", 404);
  }

  const preguntas = await ExamenQuestion.find({ examen_id: examenId })
    .sort({
      orden: 1,
    })
    .populate("pregunta_id");

  return { ...examen.toObject(), preguntas };
};

//validar el encabezado de un examen
export const validarEncabezado = async (
  idEncabezado: string,
  idUsuario: string,
  sesion: ClientSession,
) => {
  const usuarioId = validarId(idUsuario);
  const encabezadoId = validarId(idEncabezado);

  const encabezadoDB = await EncabezadoExamen.findOne({
    _id: encabezadoId,
    usuario_id: usuarioId,
    activo: true,
  }).session(sesion);

  if (!encabezadoDB) {
    throw new ManejarError("El encabezado no existe, no está activo.", 404);
  }

  return encabezadoDB;
};

//crear un examen
export const createExamen = async (
  idUsuario: string,
  datos: DatosCrearExamen,
) => {
  const sesion = await mongoose.startSession();
  try {
    if (
      typeof datos.titulo !== "string" ||
      !datos.titulo.trim() ||
      !Array.isArray(datos.preguntas)
    ) {
      throw new ManejarError("Los datos del examen están incompletos", 400);
    }

    validarPreguntas(datos.preguntas);

    let resultado: InstanceType<typeof Exam> | undefined;

    const examen = await sesion.withTransaction(async () => {
      //validando el encabezado del examen
      await validarEncabezado(datos.encabezado_id, idUsuario, sesion);

      const seleccion = await obtenerPreguntasValidas(
        datos.preguntas,
        idUsuario,
        sesion,
      );

      const puntuacionTotal = seleccion.reduce(
        (total, pregunta) => total + pregunta.puntuacion,
        0,
      );

      //validando la descripcion del examen
      if (!datos.descripcion || typeof datos.descripcion !== "string") {
        throw new ManejarError("La descripcion debe ser un texto.", 400);
      }

      const [examenCreado] = await Exam.create(
        [
          {
            usuario_id: validarId(idUsuario),
            encabezado_id: validarId(datos.encabezado_id),
            titulo: datos.titulo.trim(),
            descripcion: datos.descripcion,
            estado: Estado.BORRADOR,
            cantidad_preguntas: seleccion.length,
            puntuacion_total: puntuacionTotal,
          },
        ],
        { session: sesion },
      );

      if (!examenCreado) {
        throw new ManejarError("No fue posible crear el examen.", 500);
      }

      resultado = examenCreado;

      const preguntasExamen = seleccion.map((pregunta, indice) => ({
        examen_id: examenCreado._id,
        pregunta_id: pregunta.pregunta_id,
        numero: indice + 1,
        orden: pregunta.orden,
        puntuacion: pregunta.puntuacion,
      }));

      await ExamenQuestion.insertMany(preguntasExamen, { session: sesion });

      resultado = examenCreado;

      if (!resultado) {
        throw new ManejarError("No fue posible crear el examen", 500);
      }

      return resultado;
    });
  } catch (error) {
    throw error;
  } finally {
    await sesion.endSession();
  }
};

//actualizar un examen
export const actualizarExam = async (
  idUsuario: string,
  idExamen: string,
  datos: DatosActualizarExamen,
) => {
  const usuarioId = validarId(idUsuario);
  const examenId = validarId(idExamen);
  const sesion = await mongoose.startSession();

  try {
    let resultado: InstanceType<typeof Exam> | undefined;

    await sesion.withTransaction(async () => {
      const examen = await Exam.findOne({
        _id: examenId,
        usuario_id: usuarioId,
      }).session(sesion);

      if (!examen) {
        throw new ManejarError("Examen no encontrado", 404);
      }

      if (
        examen.estado === Estado.ARCHIVADO ||
        examen.estado === Estado.APLICADO
      ) {
        throw new ManejarError(
          "No se puede modificar un examen archivado o aplicado",
          409,
        );
      }

      if (datos.titulo !== undefined) {
        if (typeof datos.titulo !== "string" || !datos.titulo.trim()) {
          throw new ManejarError("El título no puede estar vacío", 400);
        }
        examen.titulo = datos.titulo.trim();
      }

      if (datos.descripcion !== undefined) {
        if (typeof datos.descripcion !== "string") {
          throw new ManejarError("La descripción debe ser un texto.", 400);
        }

        examen.descripcion = datos.descripcion.trim();
      }

      if (datos.encabezado_id !== undefined) {
        await validarEncabezado(datos.encabezado_id, idUsuario, sesion);
        examen.encabezado_id = validarId(datos.encabezado_id);
      }

      if (datos.preguntas !== undefined) {
        validarPreguntas(datos.preguntas);

        const seleccion = await obtenerPreguntasValidas(
          datos.preguntas,
          idUsuario,
          sesion,
        );

        await ExamenQuestion.deleteMany(
          { examen_id: examen._id },
          { session: sesion },
        );

        await ExamenQuestion.insertMany(
          seleccion.map((pregunta, indice) => ({
            examen_id: examen._id,
            pregunta_id: pregunta.pregunta_id,
            numero: indice + 1,
            orden: pregunta.orden,
            puntuacion: pregunta.puntuacion,
          })),
          { session: sesion },
        );

        examen.cantidad_preguntas = seleccion.length;
        examen.puntuacion_total = seleccion.reduce(
          (total, pregunta) => total + pregunta.puntuacion,
          0,
        );
      }
      await examen.save({ session: sesion });
      resultado = examen;

      if (!resultado) {
        throw new ManejarError("No fue posible actualizar el examen", 400);
      }
    });
    return resultado;
  } catch (error) {
    throw error;
  } finally {
    await sesion.endSession();
  }
};

//eliminar un examen
export const deleteExamen = async (idExamen: string, idUsuario: string) => {
  const examenId = validarId(idExamen);
  const usuarioId = validarId(idUsuario);
  try {
    const examen = await Exam.findOneAndUpdate(
      {
        _id: examenId,
        usuario_id: usuarioId,
        estado: {
          $nin: [Estado.ARCHIVADO, Estado.APLICADO],
        },
      },
      {
        $set: {
          estado: Estado.ARCHIVADO,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return examen;
  } catch (error) {
    throw error;
  }
};

//función para validar un examen
export const validarExamen = async (
  idUsuario: Types.ObjectId,
  idExamen: Types.ObjectId,
) => {
  try {
    const examen = await Exam.findOne({
      _id: idExamen,
      usuario_id: idUsuario,
      estado: { $ne: Estado.ARCHIVADO },
    });

    if (!examen) {
      throw new ManejarError("Examen no encontrado", 400);
    }

    return examen;
  } catch (error) {
    throw error;
  }
};
