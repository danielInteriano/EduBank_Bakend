import type { Types } from "mongoose";
import Signature from "../models/asignatura.model.js";

//obtener una asignatura
export const obtenerAsignaturaPorId = async (id: string) => {
  const asignatura = await Signature.findById(id);
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
  return Signature.find({
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
  nombre: string,
  descripcion: string,
) => {
  const camposActualizados: Record<string, unknown> = {};

  if (nombre !== undefined) {
    camposActualizados.nombre = nombre;
  }

  if (descripcion !== undefined) {
    camposActualizados.descripcion = descripcion;
  }

  const asignaturaActualizada = await Signature.findByIdAndUpdate(
    id,
    { $set: camposActualizados },
    {
      new: true,
      runValidators: true,
    },
  );

  return camposActualizados;
};

//función para eliminar una asignatura
export const eliminar = async (id: string) => {
  Signature.findByIdAndUpdate(
    id,
    { activo: false },
    {
      new: true,
      runValidators: true,
    },
  );
};
