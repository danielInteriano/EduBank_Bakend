import { Types } from "mongoose";
import { validarId } from "../utils/validar-id.js";
import { ManejarError } from "../classes/manejo-error.class.js";
import { catchError } from "./catch-error.service.js";
import Grade from "../models/grado.model.js";
import type {
  gradoActualizado,
  gradoCreado,
} from "../interfaces/grado.interface.js";
import { escaparRegex } from "../utils/regular-expresion.js";

//obtener un grado por su id
export const obtenerGradoPorId = async (idGrado: string) => {
  const gradoId = validarId(idGrado);
  try {
    if (!Types.ObjectId.isValid(gradoId)) {
      throw new ManejarError("El id de grado es inválido.", 400);
    }

    const grado = await Grade.findById(gradoId).lean();

    if (!grado) {
      throw new ManejarError("El grado no se encontró.", 404);
    }

    return grado;
  } catch (error) {
    catchError();
  }
};

//obtener todos los grados activos
export const obtenerGrados = async (activos: boolean) => {
  const filtro = activos ? { activo: true } : {};
  try {
    const grados = await Grade.find(filtro).sort({ orden: 1 }).lean();

    if (grados.length === 0 || !grados) {
      throw new ManejarError("No se encontraron grados.", 404);
    }

    return grados;
  } catch (error) {
    catchError();
  }
};

//función para registrar un grado una vez que se crea
export const registrarGrado = async (datos: gradoCreado) => {
  const nombre = datos.nombre.trim();

  const existente = await Grade.findOne({
    $or: [
      {
        nombre: {
          $regex: `^${escaparRegex(nombre)}$`,
          $options: "i",
        },
      },
      { orden: datos.orden },
    ],
  });

  if (existente) {
    throw new ManejarError("Ya existe un grado con ese nombre.", 400);
  }

  const grado = await Grade.create({
    nombre,
    orden: datos.orden,
    activo: true,
  });

  return grado;
};

//función para actualizar un grado por su id
export const modificarGrado = async (
  idGrado: string,
  datos: gradoActualizado,
) => {
  try {
    const gradoId = validarId(idGrado);
    const cambios: gradoActualizado = {};

    if (datos.nombre !== undefined) {
      cambios.nombre = datos.nombre.trim();
    }

    if (datos.orden !== undefined) {
      cambios.orden = datos.orden;
    }

    if (Object.keys(cambios).length === 0) {
      throw new ManejarError("No se recibieron campos para actualizar", 400);
    }

    const condiciones: Record<string, unknown>[] = [];

    if (cambios.nombre !== undefined) {
      condiciones.push({
        nombre: {
          $regex: `^${escaparRegex(cambios.nombre)}$`,
          $options: "i",
        },
      });
    }

    if (cambios.orden !== undefined) {
      condiciones.push({ orden: cambios.orden });
    }

    const existente = await Grade.findOne({
      _id: { $ne: gradoId },
      $or: condiciones,
    });

    if (existente) {
      throw new ManejarError(
        "Ya existe otro grado con ese nombre o número de orden",
        409,
      );
    }

    const grado = await Grade.findByIdAndUpdate(
      gradoId,
      { $set: cambios },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!grado) {
      throw new ManejarError("Grado no encontrado", 404);
    }

    return grado;
  } catch (error) {
    catchError();
  }
};

//funcion para modificar el estado de un grado
export const cambiarEstado = async (idGrado: string, estado: boolean) => {
  const gradoId = validarId(idGrado);
  try {
    const grado = await Grade.findByIdAndUpdate(
      gradoId,
      { $set: { activo: estado } },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!grado) {
      throw new ManejarError("Grado no encontrado", 404);
    }

    return grado;
  } catch (error) {
    catchError();
  }
};
