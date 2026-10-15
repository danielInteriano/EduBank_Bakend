import BBloque from "../models/bloque.model.js";

//obtener un bloque
export const obtenerBloquePorId = async (id: string) => {
  const bloque = BBloque.findById(id);
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

//actualizar los campos de un bloque
export const actualizandoCamposBloque = async (
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

  const bloqueActualizado = await BBloque.findByIdAndUpdate(
    id,
    { $set: camposActualizados },
    {
      new: true,
      runValidators: true,
    },
  );

  return camposActualizados;
};

//eliminar un bloque cambiando su estado a no activo
export const eliminar = async (id: string) => {
  BBloque.findByIdAndUpdate(
    id,
    { activo: false },
    {
      new: true,
      runValidators: true,
    },
  );
};
