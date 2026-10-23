import { ManejarError } from "../classes/manejo-error.class.js";
import type { crearEncabezado } from "../interfaces/encabezado.interface.js";
import EncabezadoExamen from "../models/encabezado.model.js";
import { validarId } from "../utils/validar-id.js";

//obtener un encabezado de examen por su id
export const obtenerEncabezado = async (id: string) => {
  const idEncabezado = validarId(id);
  return EncabezadoExamen.findById(idEncabezado);
};

//actualizar los campos de un encabezado
export const actualizarCampos = async (campos: crearEncabezado) => {
  const id = campos.id;

  if (typeof id !== "undefined") {
    throw new ManejarError("El id no existe", 404);
  }

  const encabezadoActualizado = await EncabezadoExamen.findByIdAndUpdate(
    id,
    { $set: campos },
    {
      new: true,
      runValidators: true,
    },
  );

  return encabezadoActualizado;
};

//eliminar un encabezado por su id
export const eliminar = async (id: string) => {
  if (!id) {
    throw new ManejarError("El id es obligatorio para eliminar.", 401);
  }

  EncabezadoExamen.findByIdAndUpdate(
    id,
    { activo: false },
    {
      new: true,
      runValidators: true,
    },
  );
};
