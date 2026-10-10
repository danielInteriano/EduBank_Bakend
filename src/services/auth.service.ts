import type { iUsuarioDB } from "../interfaces/usuario.interface.js";
import Usuario from "../models/usuario.js";
import bcrypt from "bcryptjs";

//Buscar un usuario por email
let usuario;
export const buscarUsuarioPorEmail = async (email: string) => {
  usuario = await Usuario.findOne({ email }).select("+password_hash");
  return usuario;
};

//Buscar un usuario por id
export const buscarUsuarioPorId = async (id: string) => {
  usuario = await Usuario.findById(id);
  return usuario;
};

//Valida el password del usuario
export const validarPassword = async (password: string): Promise<boolean> => {
  return bcrypt.compareSync(password, usuario!.password_hash);
};
