import { Types } from "mongoose";
import { ManejarError } from "../classes/manejo-error.class.js";
import BTema from "../models/tema.model.js";
import BBloque from "../models/bloque.model.js";
import TTema from "../models/tema.model.js";
import Question from "../models/pregunta.model.js";
import { catchError } from "./catch-error.service.js";
import { validarId } from "../utils/validar-id.js";
import type { DatosActualizarTema } from "../interfaces/tema.interface.js";

//obtener un tema
export const obtenerTemaPorId = async (id: string) => {
  const idTema = validarId(id);
  const tema = BTema.findById(idTema);
  return tema;
};

//obtener todos los temas
export const obtenerTemas = async () => {
  const temas = await BTema.find();
  return temas;
};

//contar todos los temas
export const contarTemas = async () => {
  return BTema.countDocuments();
};

//obtener tema por nombre
export const obtenerTemaPorNombre = async (nombre: string) => {
  if (typeof nombre !== "string" || !nombre.trim()) {
    throw new ManejarError("El nombre del bloque debe ser un texto.", 400);
  }

  return BTema.findOne({ nombre: nombre.trim() });
};

//obtener todos las preguntas de un tema
export const obtenerPreguntasPorTema = async (idTema: string) => {
  try {
    // Validar el ObjectId
    if (!Types.ObjectId.isValid(idTema)) {
      throw new ManejarError("El identificador del tema no es válido", 401);
    }

    const temaId = new Types.ObjectId(idTema);

    // Verificar que el tema exista
    const temaExiste = await TTema.exists({
      _id: temaId,
    });

    if (!temaExiste) {
      throw new ManejarError("El bloque no existe", 404);
    }

    // Obtener todas las preguntas del tema
    const preguntas = await Question.find({
      tema_id: new Types.ObjectId(idTema),
      activo: true,
    }).sort({ nombre: 1 });

    return preguntas;
  } catch (error) {
    catchError();
  }
};

//actualizar los campos de un tema
export const actualizandoCamposTema = async (
  idTema: string,
  datos: DatosActualizarTema,
) => {
  const temaId = validarId(idTema);
  const temaActualizado = await BTema.findByIdAndUpdate(
    temaId,
    { $set: datos },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return temaActualizado;
};

//eliminar un tema cambiando su estado a no activo
export const eliminar = async (id: string) => {
  const idTema = validarId(id);
  const temaEliminado = await BTema.findByIdAndUpdate(
    idTema,
    { activo: false },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  return temaEliminado;
};
