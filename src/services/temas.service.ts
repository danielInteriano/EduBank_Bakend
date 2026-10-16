import BTema from "../models/tema.model.js";

//obtener un tema
export const obtenerTemaPorId = async (id: string) => {
  const tema = BTema.findById(id);
  return tema;
};

//obtener todos los temas
export const obtenerTemas = async () => {
  const temas = await BTema.find();
  return temas;
};

//contar todos los temas
export const contarTemas = async () => {
  return BTema.countDocuments();
};

//obtener tema por nombre
export const obtenerTemaPorNombre = async (nombre: string) => {
  return BTema.findOne({ nombre: nombre.trim() });
};

//actualizar los campos de un tema
export const actualizandoCamposTema = async (
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

  const temaActualizado = await BTema.findByIdAndUpdate(
    id,
    { $set: camposActualizados },
    {
      new: true,
      runValidators: true,
    },
  );

  return camposActualizados;
};

//eliminar un tema cambiando su estado a no activo
export const eliminar = async (id: string) => {
  BTema.findByIdAndUpdate(
    id,
    { activo: false },
    {
      new: true,
      runValidators: true,
    },
  );
};
