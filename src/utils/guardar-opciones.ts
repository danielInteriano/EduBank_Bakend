import { ManejarError } from "../classes/manejo-error.class.js";
import {
  TipoPregunta,
  type Opciones,
} from "../interfaces/pregunta.interface.js";
import Question from "../models/pregunta.model.js";
import { validarId } from "./validar-id.js";

export const guardarOpciones = async (
  idPregunta: string,
  idUsuario: string,
  opciones: Opciones[],
) => {
  const preguntaId = validarId(idPregunta);
  const usuarioId = validarId(idUsuario);
  const tiposConOpciones: TipoPregunta[] = [
    TipoPregunta.SELECCION_UNICA,
    TipoPregunta.SELECCION_MULTIPLE,
  ];

  // Validando la cantidad mínima de opciones
  if (!Array.isArray(opciones) || opciones.length < 2) {
    throw new ManejarError("La pregunta debe tener al menos dos opciones", 400);
  }

  //validando el contenido de cada opción
  for (const opcion of opciones) {
    if (
      typeof opcion.opcion !== "string" ||
      !opcion.opcion.trim() ||
      typeof opcion.esCorrecta !== "boolean"
    ) {
      throw new ManejarError(
        "El atributo opcion: 'string' y esCorrecta: 'boolean'",
        400,
      );
    }
  }

  const pregunta = await Question.findOne({
    _id: preguntaId,
    usuario_id: usuarioId,
    activo: true,
    tipo: tiposConOpciones,
  });

  if (!pregunta) {
    throw new ManejarError("Pregunta no encontrada o no permite opciones", 400);
  }

  const cantidadCorrectas = opciones.filter((opcion) => {
    opcion.esCorrecta;
  }).length;

  //validando las reglas para selección única o múltiple
  if (
    pregunta.tipo === TipoPregunta.SELECCION_UNICA &&
    cantidadCorrectas !== 1
  ) {
    throw new ManejarError(
      "El tipo selección única solo permite una opción correcta.",
      400,
    );
  }

  if (
    pregunta.tipo === TipoPregunta.SELECCION_MULTIPLE &&
    cantidadCorrectas < 1
  ) {
    throw new ManejarError(
      "El tipo selección múltiple debe tener más de una opción correcta.",
      400,
    );
  }

  pregunta.opciones = opciones;
  pregunta.save();

  return pregunta;
};
