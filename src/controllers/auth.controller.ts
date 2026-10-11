import { response } from "express";
import Usuario from "../models/usuario.js";
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";
import {
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  validarPassword,
} from "../services/usuario.service.js";

//función para login de un usuario
export const login = async (req: any, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificando si el email existe
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado.",
      });
    }

    // Verificar password
    const validPassword = await validarPassword(password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "La contraseña es incorrecta.",
      });
    }

    // Generar JWT y logear al usuario
    const token: string = generarJWT(usuario.id);
    return res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

//función para logearse con autenticación de google
export const googleSignIn = async (req: any, res = response) => {
  try {
    //Obteniendo datos de googleSingIn
    const { email, given_name, family_name, picture, email_verified } =
      await googleVerify(req.body.token);

    if (!email || !email_verified) {
      return res.status(401).json({
        ok: false,
        msg: "Google no proporcionó un correo verificado.",
      });
    }

    let usuarioDB = await buscarUsuarioPorEmail(email);
    let usuario;

    //Verificando si usuarioDB existe
    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: given_name,
        apellido: family_name,
        email: email,
        imagen_url: picture,
      });
    } else {
      usuario = usuarioDB;
      usuario!.google = true;
    }

    //Guardando usuario en DB
    await usuario.save();

    //Creando Token
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      email,
      given_name,
      family_name,
      picture,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token de Google no es correcto",
    });
  }
};

//función para revalidar un token y logearse
export const renewToken = async (req: any, res = response) => {
  const id = req.id;

  //generar un JWT
  const token = await generarJWT(id);

  //obtener el usuario
  const usuario = await buscarUsuarioPorId(id);

  res.json({
    ok: true,
    token,
    usuario,
  });
};
