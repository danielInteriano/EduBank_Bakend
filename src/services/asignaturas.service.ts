import { Types } from "mongoose";
import Signature from "../models/asignatura.model.js";
import { validarId } from "../utils/validar-id.js";
import type { CamposActualizarAsignatura } from "../interfaces/asignatura.interface.js";

//obtener una asignatura
export const obtenerAsignaturaPorId = async (id: string) => {
  const idAsignatura = validarId(id);
  const asignatura = await Signature.findById(idAsignatura);
  return asignatura;
};

//obtener varias asignaturas
export const obtenerAsignaturas = async (desde: number) => {
  return Signature.find({}, "nombre descripcion").skip(desde).limit(5);
};

//contar todas las asignaturas
export const contarAsignaturas = async () => {
  return Signature.countDocuments();
};

//obtener un conjunto de asignaturas por ids
export const obtenerAsignaturasPorIds = async (ids: string[]) => {
  return await Signature.find({
    _id: { $in: ids },
    activo: true,
  });
};

//obtener una asignatura por nombre
export const obtenerAsignaturaPorNombre = async (nombre: string) => {
  return Signature.findOne({ nombre: nombre.trim() });
};

//actualizar los campos de una asignatura
export const actualizandoCamposAsignatura = async (
  id: string,
  datos: CamposActualizarAsignatura,
) => {
  const asignaturaActualizada = await Signature.findByIdAndUpdate(
    id,
    { $set: datos },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return asignaturaActualizada;
};

//función para eliminar una asignatura
export const eliminar = async (id: string) => {
  const asignatura = await Signature.findByIdAndUpdate(
    id,
    { activo: false },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return asignatura;
};
