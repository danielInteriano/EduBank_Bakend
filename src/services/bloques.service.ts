import { Types } from "mongoose";
import BBloque from "../models/bloque.model.js";
import { ManejarError } from "../classes/manejo-error.class.js";
import TTema from "../models/tema.model.js";
import type { DatosActualizarBloque } from "../interfaces/bloque.interface.js";
import { validarId } from "../utils/validar-id.js";

//obtener un bloque
export const obtenerBloquePorId = async (id: string) => {
  const idBloque = validarId(id);
  const bloque = await BBloque.findById(idBloque);
  return bloque;
};

//obtener todos los bloques
export const obtenerBloques = async () => {
  const bloques = await BBloque.find();
  return bloques;
};

//contar todos los bloques
export const contarBloques = async () => {
  return BBloque.countDocuments();
};

//obtener bloque por nombre
export const obtenerBloquePorNombre = async (nombre: string) => {
  return BBloque.findOne({ nombre: nombre.trim() });
};

//obtener todos los temas de un bloque
//obtener todos los temas de un bloque
export const obtenerTemasPorBloque = async (idBloque: string) => {
  // Validar el ObjectId
  if (!Types.ObjectId.isValid(idBloque)) {
    throw new ManejarError("El identificador del bloque no es válido", 401);
  }

  const bloqueId = new Types.ObjectId(idBloque);

  // Verificar que el bloque exista
  const bloqueExiste = await BBloque.exists({
    _id: bloqueId,
  });

  if (!bloqueExiste) {
    throw new ManejarError("El bloque no existe", 404);
  }

  // Obtener los temas activos del bloque
  const temas = await TTema.find({
    bloque_id: bloqueId,
    activo: true,
  }).sort({ nombre: 1 });

  return temas;
};

//actualizar los campos de un bloque
export const actualizandoCamposBloque = async (
  idBloque: string,
  datos: DatosActualizarBloque,
) => {
  const bloqueActualizado = await BBloque.findByIdAndUpdate(
    idBloque,
    { $set: datos },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return bloqueActualizado;
};

//eliminar un bloque cambiando su estado a no activo
export const eliminar = async (idBloque: string) => {
  const bloqueEliminado = await BBloque.findByIdAndUpdate(
    idBloque,
    { activo: false },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  return bloqueEliminado;
};
