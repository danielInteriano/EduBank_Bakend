import { ManejarError } from "../classes/manejo-error.class.js";
import { TipoPregunta } from "../interfaces/pregunta.interface.js";
import Question from "../models/pregunta.model.js";
import { validarId } from "./validar-id.js";

export const obtenerOpciones = async (
  idPregunta: string,
  idUsuario: string,
) => {
  const preguntaId = validarId(idPregunta);
  const usuarioId = validarId(idUsuario);

  const tiposConOpciones: TipoPregunta[] = [
    TipoPregunta.SELECCION_UNICA,
    TipoPregunta.SELECCION_MULTIPLE,
  ];

  const pregunta = await Question.findOne({
    _id: preguntaId,
    usuario_id: usuarioId,
    activo: true,
    tipo: { $in: tiposConOpciones },
  }).select("opciones tipo");

  if (!pregunta) {
    throw new ManejarError("Pregunta no encontrada o no permite opciones", 400);
  }

  return pregunta.opciones ?? [];
};
