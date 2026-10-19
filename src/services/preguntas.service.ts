import { Types } from "mongoose";
import { ManejarError } from "../classes/manejo-error.class.js";
import {
  NivelDificultad,
  TipoPregunta,
  type ActualizarQuestion,
  type crearQuestion,
  type DatosFinales,
} from "../interfaces/pregunta.interface.js";
import Signature from "../models/asignatura.model.js";
import BBloque from "../models/bloque.model.js";
import Question from "../models/pregunta.model.js";
import TTema from "../models/tema.model.js";

//obtener una pregunta
export const obtenerPreguntaPorId = async (id: string) => {
  const pregunta = Question.findById(id);
  return pregunta;
};

//obtener un conjunto de preguntas
export const obtenerPreguntasPorIds = async (ids: string[]) => {
  return Question.find({
    _id: { $in: ids },
    activo: true,
  });
};

//crear una pregunta
export const crear = async (datos: crearQuestion, idUsuario: string) => {
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
  } = datos;

  //verificar que la asignatura,bloque y tema existan
  const asignatura = await Signature.findById(asignatura_id);

  if (!asignatura || asignatura.activo === false) {
    throw new ManejarError("La asignatura no existe o esta inactiva.", 404);
  }

  const bloque = await BBloque.findById(bloque_id);

  if (!bloque || bloque.activo === false) {
    throw new ManejarError("El bloque no existe o esta inactivo", 404);
  }

  if (String(bloque.asignatura_id) !== String(asignatura_id)) {
    throw new ManejarError("El bloque no pertenece a la asignatura", 404);
  }

  const tema = await TTema.findById(tema_id);

  if (!tema || tema.activo === false) {
    throw new ManejarError("El tema no existe o está inactivo", 404);
  }

  if (String(tema.bloque_id) !== String(bloque_id)) {
    throw new ManejarError("El tema no pertenece al bloque", 404);
  }

  switch (tipo) {
    case TipoPregunta.SELECCION_UNICA: {
      if (!opciones || opciones.length < 2) {
        throw new ManejarError("Se requieren al menos 2 opciones", 400);
      }

      const correctas = opciones.filter((opcion) => opcion.esCorrecta === true);

      if (correctas.length !== 1) {
        throw new ManejarError("Solo debe existir una respuesta correcta", 400);
      }

      break;
    }

    case TipoPregunta.SELECCION_MULTIPLE: {
      if (!opciones || opciones.length < 2) {
        throw new ManejarError(
          "Deben haber al menos dos opciones correctas.",
          400,
        );
      }

      if (!opciones.some((opcion) => opcion.esCorrecta === true)) {
        throw new ManejarError(
          "Debe existir al menos una opción correcta.",
          400,
        );
      }

      break;
    }

    case TipoPregunta.VERDADERO_FALSO:
    case TipoPregunta.CORRECTO_INCORRECTO: {
      if (typeof respuesta_correcta !== "boolean") {
        throw new ManejarError("La respuesta debe ser un booleano.", 400);
      }

      break;
    }

    case TipoPregunta.TERMINOS_PAREADOS: {
      if (!pares || pares.length < 2) {
        throw new ManejarError("Deben ser al menos dos pares.", 400);
      }
      break;
    }

    case TipoPregunta.COMPLETACION: {
      if (
        typeof respuesta_correcta !== "string" ||
        !respuesta_correcta.trim()
      ) {
        throw new ManejarError("La respuesta correcta es obligatoria.", 400);
      }

      break;
    }

    case TipoPregunta.RESPUESTA_BREVE: {
      if (
        typeof respuesta_correcta !== "string" ||
        !respuesta_correcta.trim()
      ) {
        throw new ManejarError("La respuesta correcta es obligatoria.", 400);
      }
      break;
    }

    default:
      throw new ManejarError("El tipo de pregunta no es válido.", 400);
  }

  if (
    typeof respuesta_correcta !== "string" ||
    typeof respuesta_correcta !== "boolean"
  ) {
    throw new ManejarError("El respuesta no tiene el tipo correcto", 400);
  }

  const pregunta = await Question.create({
    usuario_id: new Types.ObjectId(idUsuario),
    asignatura_id: new Types.ObjectId(asignatura_id),
    bloque_id: new Types.ObjectId(bloque_id),
    tema_id: new Types.ObjectId(tema_id),
    tipo,
    enunciado: enunciado.trim(),
    ...(respuesta_correcta !== undefined && {
      respuesta_correcta,
    }),
    ...(opciones !== undefined && { opciones }),
    ...(pares !== undefined && { pares }),
    puntuacion,
    ...(imagen_url !== undefined && { imagen_url }),
    ...(explicacion !== undefined && { explicacion }),
    ...(dificultad !== undefined && { dificultad }),
    activo: true,
  });

  return pregunta;
};

//actualizar una pregunta
export const actualizar = async (
  idQuestion: string,
  idUsuario: string,
  cambios: ActualizarQuestion,
) => {
  if (!Types.ObjectId.isValid(idQuestion)) {
    throw new ManejarError("El ID de la pregunta no es válido.", 400);
  }

  if (!Types.ObjectId.isValid(idUsuario)) {
    throw new ManejarError("El ID de usuario no es válido.", 401);
  }

  //Comprobando si la pregunta pertenece al usuario
  const pregunta = await Question.findOne({
    _id: idQuestion,
    usuario_id: new Types.ObjectId(idUsuario),
  });

  if (!pregunta) {
    throw new ManejarError(
      "No se encontró la pregunta o no tiene permiso para modificarla",
      400,
    );
  }

  //Cambiando los valores existentes en la pregunta con los que serán modificados
  const datosFinales: DatosFinales = {
    tipo: pregunta.tipo,
    enunciado: pregunta.enunciado,
    puntuacion: pregunta.puntuacion,
    asignatura_id: pregunta.asignatura_id,
    bloque_id: pregunta.bloque_id,
    tema_id: pregunta.tema_id,
    ...(pregunta.respuesta_correcta !== undefined && {
      respuesta_correcta: pregunta.respuesta_correcta,
    }),
    ...(pregunta.opciones !== undefined && {
      opciones: pregunta.opciones.map((opcion) => ({
        opcion: opcion.opcion,
        esCorrecta: opcion.esCorrecta,
      })),
    }),
    ...(pregunta.pares !== undefined && {
      pares: pregunta.pares.map((par) => ({
        izquierda: par.izquierda,
        derecha: par.derecha,
      })),
    }),
    ...(pregunta.imagen_url !== undefined && {
      imagen_url: pregunta.imagen_url,
    }),
    ...(pregunta.explicacion !== undefined && {
      explicacion: pregunta.explicacion,
    }),
    ...(pregunta.dificultad !== undefined && {
      dificultad: pregunta.dificultad,
    }),
  };

  //aplicar los cambios solo a los campos enviados
  for (const campo of [
    "tipo",
    "enunciado",
    "respuesta_correcta",
    "opciones",
    "pares",
    "puntuacion",
    "imagen_url",
    "explicacion",
    "dificultad",
    "asignatura_id",
    "bloque_id",
    "tema_id",
  ] as const) {
    if (Object.hasOwn(cambios, campo)) {
      Object.assign(datosFinales, {
        [campo]: cambios[campo],
      });
    }
  }

  //validando el tipo de pregunta
  if (!Object.values(TipoPregunta).includes(datosFinales.tipo)) {
    throw new ManejarError("El tipo de pregunta no es válido.", 400);
  }

  //limpiando los datos incompatibles con el tipo final de pregunta
  switch (datosFinales.tipo) {
    case TipoPregunta.SELECCION_UNICA:
    case TipoPregunta.SELECCION_MULTIPLE:
      delete datosFinales.pares;
      delete datosFinales.respuesta_correcta;
      break;

    case TipoPregunta.VERDADERO_FALSO:
    case TipoPregunta.CORRECTO_INCORRECTO:
      delete datosFinales.opciones;
      delete datosFinales.pares;
      break;

    case TipoPregunta.TERMINOS_PAREADOS:
      delete datosFinales.opciones;
      delete datosFinales.respuesta_correcta;
      break;

    case TipoPregunta.COMPLETACION:
    case TipoPregunta.RESPUESTA_BREVE:
      delete datosFinales.opciones;
      delete datosFinales.pares;
      break;

    default:
      break;
  }

  //validar el enunciado de la pregunta
  if (
    typeof datosFinales.enunciado !== "string" ||
    !datosFinales.enunciado.trim()
  ) {
    throw new ManejarError("El enunciado es obligatorio.", 400);
  }

  datosFinales.enunciado = datosFinales.enunciado.trim();

  //validando la puntuación
  if (
    typeof datosFinales.puntuacion !== "number" ||
    !Number.isFinite(datosFinales.puntuacion) ||
    datosFinales.puntuacion <= 0
  ) {
    throw new ManejarError("La puntuación debe ser mayor que cero.", 400);
  }

  // Validando la dificultad
  if (
    datosFinales.dificultad !== undefined &&
    !Object.values(NivelDificultad).includes(datosFinales.dificultad)
  ) {
    throw new ManejarError("La dificultad no es válida.", 400);
  }

  // Validando según el tipo de pregunta
  switch (datosFinales.tipo) {
    case TipoPregunta.SELECCION_UNICA:
    case TipoPregunta.SELECCION_MULTIPLE: {
      const opciones = datosFinales.opciones;

      if (!Array.isArray(opciones) || opciones.length < 2) {
        throw new ManejarError("Se requieren al menos dos opciones.", 400);
      }

      if (
        opciones.some(
          (opcion) =>
            typeof opcion.opcion !== "string" ||
            !opcion.opcion.trim() ||
            typeof opcion.esCorrecta !== "boolean",
        )
      ) {
        throw new ManejarError(
          "Cada opción debe tener texto y una marca de corrección válida.",
          400,
        );
      }

      const cantidadCorrectas = opciones.filter(
        (opcion) => opcion.esCorrecta,
      ).length;

      if (
        datosFinales.tipo === TipoPregunta.SELECCION_UNICA &&
        cantidadCorrectas !== 1
      ) {
        throw new ManejarError("Solo una opción debe ser correcta.", 400);
      }

      if (
        datosFinales.tipo === TipoPregunta.SELECCION_MULTIPLE &&
        cantidadCorrectas < 1
      ) {
        throw new ManejarError(
          "Se requieren al menos dos opciones correctas.",
          400,
        );
      }

      datosFinales.opciones = opciones.map((opcion) => ({
        opcion: opcion.opcion.trim(),
        esCorrecta: opcion.esCorrecta,
      }));

      break;
    }

    case TipoPregunta.VERDADERO_FALSO:
    case TipoPregunta.CORRECTO_INCORRECTO:
      if (typeof datosFinales.respuesta_correcta !== "boolean") {
        throw new ManejarError("La respuesta correcta debe ser booleana.", 400);
      }
      break;

    case TipoPregunta.TERMINOS_PAREADOS: {
      const pares = datosFinales.pares;

      if (!Array.isArray(pares) || pares.length < 2) {
        throw new ManejarError("Se requieren al menos dos pares.", 400);
      }

      if (
        pares.some(
          (par) =>
            typeof par.izquierda !== "string" ||
            !par.izquierda.trim() ||
            typeof par.derecha !== "string" ||
            !par.derecha.trim(),
        )
      ) {
        throw new ManejarError("Cada par debe tener ambos términos.", 400);
      }

      datosFinales.pares = pares.map((par) => ({
        izquierda: par.izquierda.trim(),
        derecha: par.derecha.trim(),
      }));

      break;
    }

    case TipoPregunta.COMPLETACION:
    case TipoPregunta.RESPUESTA_BREVE:
      if (
        typeof datosFinales.respuesta_correcta !== "string" ||
        !datosFinales.respuesta_correcta.trim()
      ) {
        throw new ManejarError(
          "La respuesta correcta debe ser un texto no vacío.",
          400,
        );
      }

      datosFinales.respuesta_correcta = datosFinales.respuesta_correcta.trim();

      break;
  }

  // Validando las referencias si se modificaron
  if (Object.hasOwn(cambios, "asignatura_id")) {
    if (
      typeof datosFinales.asignatura_id !== "string" ||
      !Types.ObjectId.isValid(datosFinales.asignatura_id) ||
      !(await Signature.exists({
        _id: datosFinales.asignatura_id,
      }))
    ) {
      throw new ManejarError("La asignatura no es válida.", 400);
    }
  }

  if (Object.hasOwn(cambios, "bloque_id")) {
    if (
      typeof datosFinales.bloque_id !== "string" ||
      !Types.ObjectId.isValid(datosFinales.bloque_id) ||
      !(await BBloque.exists({ _id: datosFinales.bloque_id }))
    ) {
      throw new ManejarError("El bloque no es válido.", 400);
    }
  }

  if (Object.hasOwn(cambios, "tema_id")) {
    if (
      typeof datosFinales.tema_id !== "string" ||
      !Types.ObjectId.isValid(datosFinales.tema_id) ||
      !(await TTema.exists({ _id: datosFinales.tema_id }))
    ) {
      throw new ManejarError("El tema no es válido.", 400);
    }
  }

  //aplicando los cambios a la pregunta
  pregunta.set({
    ...datosFinales,
    asignatura_id: new Types.ObjectId(datosFinales.asignatura_id),
    bloque_id: new Types.ObjectId(datosFinales.bloque_id),
    tema_id: new Types.ObjectId(datosFinales.tema_id),
  });

  await pregunta.save();
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
      new: true,
      runValidators: true,
    },
  );

  // Verificar si existe una pregunta activa
  if (!pregunta) {
    throw new ManejarError("La pregunta cambio su estado a inactiva.", 404);
  }

  return pregunta;
};
