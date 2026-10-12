import Signature from "../models/asignatura.js";

//obtener una asignatura
export const obtenerAsignatura = async (id: string) => {
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
