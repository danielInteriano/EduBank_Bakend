import { Types, type ClientSession } from "mongoose";
import { ManejarError } from "../classes/manejo-error.class.js";
import {
  TipoPregunta,
  type DatosActualizarPregunta,
  type DatosCrearPregunta,
  type Opciones,
} from "../interfaces/pregunta.interface.js";
import Signature from "../models/asignatura.model.js";
import BBloque from "../models/bloque.model.js";
import Question from "../models/pregunta.model.js";
import TTema from "../models/tema.model.js";
import { validarId } from "../utils/validar-id.js";
import type { PreguntaSeleccionada } from "../interfaces/examen.interface.js";

//obtener una pregunta
export const obtenerPreguntaPorId = async (id: string) => {
  const idPregunta = validarId(id);
  const pregunta = await Question.findById(idPregunta);
  return pregunta;
};

//obtener un conjunto de preguntas
export const obtenerPreguntasPorIds = async (ids: string[]) => {
  const idPreguntas = ids.map(validarId);
  const preguntas = await Question.find({
    _id: { $in: idPreguntas },
    activo: true,
  });

  //mantener el orden de las preguntas según el arreglo de ids proporcionado
  const preguntasOrdenadas = idPreguntas
    .map((id) =>
      preguntas.find((pregunta) => pregunta._id.toString() === id.toString()),
    )
    .filter((pregunta) => pregunta !== undefined);

  return preguntasOrdenadas;
};

//crear una pregunta
export const crearPregunta = async (
  datos: DatosCrearPregunta,
  idUsuario: string,
) => {
  //verificacion de todos los ids que se envian en la creación de la pregunta
  if (
    !Types.ObjectId.isValid(idUsuario) ||
    !Types.ObjectId.isValid(datos.asignatura_id) ||
    !Types.ObjectId.isValid(datos.bloque_id) ||
    !Types.ObjectId.isValid(datos.tema_id) ||
    !Types.ObjectId.isValid(datos.grado_id)
  ) {
    throw new ManejarError("Uno o más IDs proporcionados no son válidos.", 400);
  }

  //verificar que la asignatura,bloque y tema existan
  const asignatura = await Signature.findById(datos.asignatura_id);

  if (!asignatura || asignatura.activo === false) {
    throw new ManejarError("La asignatura no existe o esta inactiva.", 404);
  }

  const bloque = await BBloque.findById(datos.bloque_id);

  if (!bloque || bloque.activo === false) {
    throw new ManejarError("El bloque no existe o esta inactivo", 404);
  }

  if (String(bloque.asignatura_id) !== String(datos.asignatura_id)) {
    throw new ManejarError("El bloque no pertenece a la asignatura", 404);
  }

  const tema = await TTema.findById(datos.tema_id);

  if (!tema || tema.activo === false) {
    throw new ManejarError("El tema no existe o está inactivo", 404);
  }

  if (String(tema.bloque_id) !== String(datos.bloque_id)) {
    throw new ManejarError("El tema no pertenece al bloque", 404);
  }

  switch (datos.tipo) {
    case TipoPregunta.SELECCION_UNICA: {
      if (datos.opciones.length < 2) {
        throw new ManejarError("Se requieren al menos 2 opciones", 400);
      }

      const correctas = datos.opciones.filter(
        (opcion) => opcion.esCorrecta === true,
      );

      if (correctas.length !== 1) {
        throw new ManejarError("Solo debe existir una respuesta correcta", 400);
      }

      break;
    }

    case TipoPregunta.SELECCION_MULTIPLE: {
      if (!datos.opciones || datos.opciones.length < 2) {
        throw new ManejarError(
          "Deben haber al menos dos opciones correctas.",
          400,
        );
      }

      if (!datos.opciones.some((opcion) => opcion.esCorrecta === true)) {
        throw new ManejarError(
          "Debe existir al menos una opción correcta.",
          400,
        );
      }

      break;
    }

    case TipoPregunta.VERDADERO_FALSO:
    case TipoPregunta.CORRECTO_INCORRECTO: {
      if (typeof datos.respuesta_correcta !== "boolean") {
        throw new ManejarError("La respuesta debe ser un booleano.", 400);
      }

      break;
    }

    case TipoPregunta.TERMINOS_PAREADOS: {
      if (!datos.pares || datos.pares.length < 2) {
        throw new ManejarError("Deben ser al menos dos pares.", 400);
      }
      break;
    }

    case TipoPregunta.COMPLETACION:
    case TipoPregunta.RESPUESTA_BREVE: {
      if (
        typeof datos.respuesta_correcta !== "string" ||
        !datos.respuesta_correcta.trim()
      ) {
        throw new ManejarError("La respuesta correcta es obligatoria.", 400);
      }

      break;
    }

    default:
      throw new ManejarError("El tipo de pregunta no es válido.", 400);
  }

  const pregunta = await Question.create({
    ...datos,
    usuario_id: new Types.ObjectId(idUsuario),
    asignatura_id: new Types.ObjectId(datos.asignatura_id),
    bloque_id: new Types.ObjectId(datos.bloque_id),
    tema_id: new Types.ObjectId(datos.tema_id),
    grado_id: new Types.ObjectId(datos.grado_id),
  });

  return pregunta;
};

//actualizar una pregunta
export const actualizar = async (
  idQuestion: string,
  idUsuario: string,
  cambios: DatosActualizarPregunta,
) => {
  if (!Types.ObjectId.isValid(idQuestion)) {
    throw new ManejarError("El ID de la pregunta no es válido.", 400);
  }

  if (!Types.ObjectId.isValid(idUsuario)) {
    throw new ManejarError("El ID de usuario no es válido.", 400);
  }

  if (!cambios || Object.keys(cambios).length === 0) {
    throw new ManejarError("No se proporcionaron datos para actualizar.", 400);
  }

  //evitar modificaciones de los campos protegidos
  const camposProtegidos = [
    "_id",
    "usuario_id",
    "activo",
    "fecha_creacion",
    "fecha_actualizacion",
  ];

  //verificando si los cambios contienen campos protegidos
  const contineCamposProtegidos = Object.keys(cambios).some((campo) =>
    camposProtegidos.includes(campo),
  );

  if (contineCamposProtegidos) {
    throw new ManejarError(
      "No se pueden modificar los campos protegidos.",
      400,
    );
  }

  const pregunta = await Question.findOneAndUpdate(
    {
      _id: new Types.ObjectId(idQuestion),
      usuario_id: new Types.ObjectId(idUsuario),
      activo: true,
    },
    {
      $set: {
        ...cambios,
        fecha_actualizacion: new Date(),
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!pregunta) {
    throw new ManejarError(
      "No se encontró la pregunta o no tiene permiso para modificarla",
      404,
    );
  }

  return pregunta;
};

//eliminar una pregunta
export const eliminar = async (id: string, idUsuario: string) => {
  // Validando los parámetros
  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(idUsuario)) {
    throw new ManejarError(
      "Identificador de pregunta o usuario no válido",
      400,
    );
  }

  // Buscar la pregunta del usuario y cambiar su estado
  const pregunta = await Question.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      usuario_id: new Types.ObjectId(idUsuario),
      activo: true,
    },
    {
      $set: { activo: false },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  // Verificar si existe una pregunta activa
  if (!pregunta) {
    throw new ManejarError("La pregunta cambio su estado a inactiva.", 404);
  }

  return pregunta;
};

//agregar una opción a una pregunta de selección única o múltiple
export const agregarOpcionAPregunta = async (
  idPregunta: string,
  idUsuario: string,
  nuevaOpcion: Opciones,
) => {
  const preguntaId = validarId(idPregunta);
  const usuarioId = validarId(idUsuario);

  //validando los datos de la nueva opción
  if (!nuevaOpcion.opcion.trim()) {
    throw new ManejarError("El texto de la opción es obligatorio.", 400);
  }

  if (typeof nuevaOpcion.esCorrecta !== "boolean") {
    throw new ManejarError("Debe indicar si la opción es correcta.", 400);
  }

  const tiposConOpciones: TipoPregunta[] = [
    TipoPregunta.SELECCION_UNICA,
    TipoPregunta.SELECCION_MULTIPLE,
  ];

  const pregunta = await Question.findOneAndUpdate(
    {
      _id: preguntaId,
      usuario_id: usuarioId,
      activo: true,
      tipo: { $in: tiposConOpciones },
    },
    {
      $push: {
        opciones: {
          opcion: nuevaOpcion.opcion,
          esCorrecta: nuevaOpcion.esCorrecta,
        },
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("enunciado tipo opciones puntuacion");

  if (!pregunta) {
    throw new ManejarError(
      "No se encontró la pregunta o no tiene opciones.",
      400,
    );
  }

  return pregunta;
};

//función para validar un conjunto de preguntas
export const validarPreguntas = (preguntas: PreguntaSeleccionada[]): void => {
  //validando si el arreglo "preguntas" tiene datos
  if (!Array.isArray(preguntas) || preguntas.length === 0) {
    throw new ManejarError("Debe seleccionar al menos una pregunta", 400);
  }

  const ids = preguntas.map((p) => {
    p.pregunta_id;
  });

  const ordenes = preguntas.map((p) => {
    p.orden;
  });

  //validando si el arreglo "ids" tiene datos válidos
  if (ids.some((id) => typeof id !== "string")) {
    throw new ManejarError("Todas las preguntas deben tener un id válido", 400);
  }

  //validando que no hayan preguntas repetidas
  if (new Set(ids).size !== ids.length) {
    throw new ManejarError("No se puede repetir una pregunta.", 400);
  }

  if (
    ordenes.some((orden) => !Number.isInteger(orden) || Number(orden) < 1) ||
    new Set(ordenes).size !== ordenes.length
  ) {
    throw new ManejarError("El orden de las preguntas es único", 400);
  }

  for (const id in ids) {
    validarId(id);
  }
};

//función para obtener un conjunto de preguntas válidas
export const obtenerPreguntasValidas = async (
  preguntas: PreguntaSeleccionada[],
  idUsuario: string,
  sesion: ClientSession,
) => {
  const usuarioId = validarId(idUsuario);

  //validación de los ids de cada pregunta seleccionada
  const ids = preguntas.map((p) => {
    validarId(p.pregunta_id);
  });

  const preguntasDB = await Question.find({
    id: { $in: ids },
    usuario_id: usuarioId,
    activo: true,
  }).session(sesion);

  //validando que todas las preguntas sean validas
  if (preguntasDB.length !== preguntas.length) {
    throw new ManejarError(
      "Una o más preguntas no existen o no están activas",
      404,
    );
  }

  const porId = new Map(
    preguntasDB.map((pregunta) => [pregunta._id.toString(), pregunta]),
  );

  return preguntas.map((seleccion) => {
    const pregunta = porId.get(seleccion.pregunta_id);

    if (!pregunta) {
      throw new ManejarError("No se encontró una pregunta seleccionada", 400);
    }

    const puntuacion = Number(pregunta.puntuacion);

    if (!Number.isFinite(puntuacion) || puntuacion < 0) {
      throw new ManejarError("Una pregunta tiene una puntuación inválida", 400);
    }

    return {
      pregunta_id: pregunta._id,
      orden: seleccion.orden,
      puntuacion,
    };
  });
};
