import { encriptarPassword } from "../helpers/encriptar.js";
import type { iUsuarioDB } from "../interfaces/usuario.interface.js";
import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import { validarId } from "../utils/validar-id.js";

//Buscar un usuario por email
let usuario;
export const buscarUsuarioPorEmail = async (email: string) => {
  const usuario = await Usuario.findOne({ email }).select("+password_hash");
  return usuario;
};

//Buscar un usuario por id
export const buscarUsuarioPorId = async (id: string) => {
  const usuario = await Usuario.findById(id);
  return usuario;
};

//Valida el password del usuario
export const validarPassword = async (
  password: string,
  usuario: iUsuarioDB,
): Promise<boolean> => {
  return bcrypt.compareSync(password, usuario.password_hash);
};

//Obtener todos los usuarios
export const obtenerUsuarios = async (desde: number) => {
  return Usuario.find({}, "nombre apellido email rol imagen_url")
    .skip(desde)
    .limit(7);
};

//Contar todo los usuarios obtenidos
export const contarUsuarios = async () => {
  return Usuario.countDocuments();
};

//Actualizar campos de un usuario
export const actualizandoCampos = async (
  id: string,
  nombre: string,
  apellido: string,
  email: string,
  password_hash: string,
) => {
  const camposActualizados: Record<string, unknown> = {};

  if (nombre !== undefined) {
    camposActualizados.nombre = nombre;
  }

  if (apellido !== undefined) {
    camposActualizados.apellido = apellido;
  }

  if (email !== undefined) {
    camposActualizados.email = email;
  }

  if (password_hash !== undefined) {
    camposActualizados.password_hash = await encriptarPassword(password_hash);
  }

  const usuarioActualizado = await Usuario.findByIdAndUpdate(
    id,
    { $set: camposActualizados },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return usuarioActualizado;
};

//Eliminar un usuario
export const eliminar = async (idUsuario: string) => {
  const usuarioId = validarId(idUsuario);
  const usuarioActualizado = await Usuario.findByIdAndUpdate(
    usuarioId,
    { $set: { activo: false } },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return usuarioActualizado;
};
