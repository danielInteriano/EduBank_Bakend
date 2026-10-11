import { type Response, type Request, type NextFunction } from "express";
import Usuario from "../models/usuario.js";
import bcrypt from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt.js";
import {
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  obtenerUsuarios,
  contarUsuarios,
  actualizandoCampos,
  eliminar,
} from "../services/usuario.service.js";
import { encriptarPassword } from "../helpers/encriptar.js";

//función para obtener un usuario
export const getUsuario = async (req: Request, res: Response) => {
  const email = req.params.email;

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El correo electrónico no es válido",
    });
  }

  try {
    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró usuario con ese email",
      });
    }

    return res.status(200).json({
      ok: true,
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};

//función para obtener un usuario por id
export const getUsuarioById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del usuario no es válido",
    });
  }

  try {
    const usuario = await buscarUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el usuario con ese id.",
      });
    }

    return res.status(200).json({
      ok: true,
      usuario,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};

//función para obtener todos los usuarios
export const getUsuarios = async (req: Request, res: Response) => {
  const desde = Number(req.query.desde ?? 0);

  if (!Number.isInteger(desde) || desde < 0) {
    return res.status(400).json({
      ok: false,
      msg: "El parámetro <desde> debe ser mayor o igual que 0.",
    });
  }

  try {
    const [usuarios, totalUsuarios] = await Promise.all([
      obtenerUsuarios(desde),
      contarUsuarios(),
    ]);

    return res.status(200).json({
      ok: true,
      usuarios,
      totalUsuarios,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};

//función para crear un usuario
export const crearUsuario = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El correo electrónico no es válido",
    });
  }

  if (typeof password !== "string" || !password.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El correo electrónico no es válido",
    });
  }

  try {
    const existeEmail = await buscarUsuarioPorEmail(email);

    if (existeEmail) {
      res.status(400).json({
        ok: false,
        msg: "El email ya está registrado",
      });
    }

    const usuario = new Usuario(req.body);
    usuario.password_hash = await encriptarPassword(password);

    await usuario.save();
    const token = generarJWT(usuario.id);

    return res.status(200).json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};

//función para actualizar un usuario
export const actualizarUsuario = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del usuario no es válido",
    });
  }

  try {
    const usuarioDB = await buscarUsuarioPorId(id);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: `El usuario no está registrado`,
      });
    }

    //Si el usuario existe, entonces hay que actualizarlo
    const { nombre, apellido, email, password_hash, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const emailRegistrado = await buscarUsuarioPorEmail(email);
      if (emailRegistrado) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe alguien con ese email.",
        });
      }
    }

    //Actualizando los campos de un usuario
    const usuarioActualizado = await actualizandoCampos(
      id,
      nombre,
      apellido,
      email,
      password_hash,
    );

    res.status(200).json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};

//función para eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      ok: false,
      msg: "El id del usuario no es válido",
    });
  }

  try {
    const encontrado = await buscarUsuarioPorId(id);

    if (!encontrado) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el usuario.",
      });
    }

    //Si el usuario existe, se elimina
    await eliminar(id);
    return res.status(200).json({
      ok: true,
      msg: "Usuario eliminado exitosamente.",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};
