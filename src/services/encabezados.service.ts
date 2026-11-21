import { Types } from "mongoose";
import { ManejarError } from "../classes/manejo-error.class.js";
import type {
  DatosActualizarEncabezado,
  DatosCrearEncabezado,
} from "../interfaces/encabezado.interface.js";
import EncabezadoExamen from "../models/encabezado.model.js";
import { validarId } from "../utils/validar-id.js";

//crear un encabezado
export const createEncabezado = async (
  campos: DatosCrearEncabezado,
  idUsuario: string,
) => {
  const usuarioId = validarId(idUsuario);
  const encabezado = await EncabezadoExamen.create({
    ...campos,
    usuario_id: usuarioId,
  });

  return encabezado;
};

export const obtenerEncabezado = async (id: string) => {
  const idEncabezado = validarId(id);
  const encadezado = await EncabezadoExamen.findById(idEncabezado);
  return encadezado;
};

//actualizar los campos de un encabezado
export const actualizarCampos = async (
  campos: DatosActualizarEncabezado,
  idEncabezado: string,
  idUsuario: string,
) => {
  const encabezadoId = validarId(idEncabezado);
  const usuarioId = validarId(idUsuario);

  const encabezadoActualizado = await EncabezadoExamen.findByIdAndUpdate(
    { _id: encabezadoId, usuario_id: new Types.ObjectId(usuarioId) },
    { $set: { ...campos, fecha_actualizacion: new Date() } },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return encabezadoActualizado;
};

//eliminar un encabezado por su id
export const eliminar = async (id: string) => {
  const idEncabezado = validarId(id);

  if (!idEncabezado) {
    throw new ManejarError("El id del encabezado no es válido", 400);
  }

  const encabezadoEliminado = await EncabezadoExamen.findByIdAndUpdate(
    idEncabezado,
    { activo: false },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return encabezadoEliminado;
};
