//Ruta: /api/usuarios

import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.middleware.js";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  getUsuario,
  getUsuarioById,
  getUsuarios,
} from "../controllers/usuarios.controller.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";

export const usuariosRouter = Router();

//Obtener un usuario por su email
usuariosRouter.get("/:email", validarJWT, getUsuario);

//Obtener un usuario por su id
usuariosRouter.get("/usuario/:id", validarJWT, getUsuarioById);

//Obtener todos los usuarios, de 7 en 7 para paginación
usuariosRouter.get("/", validarJWT, getUsuarios);

//Crear un usuario
usuariosRouter.post(
  "/",
  validarCampos,
  validarRol("admin"),
  [
    check("nombre", "El nombre es obligatorio")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .trim()
      .matches(/.*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*/)
      .withMessage("El nombre debe contener solo letras."),
    check("apellido", "El apellido es obligatorio")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .trim()
      .matches(/.*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*/)
      .withMessage("El nombre debe contener solo letras."),
    check("email", "El email no es válido").isEmail(),
    check("password_hash", "La contraseña es obligatoria")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .trim(),
    check("imagen_url", "Seleccione una imagen").notEmpty(),
  ],
  crearUsuario,
);

//Actualizar ciertos atributos de un usuario
usuariosRouter.patch(
  "/:id",
  validarJWT,
  validarRol("admin"),
  [
    check("nombre", "El nombre es obligatorio")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .trim()
      .matches(/.*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*/)
      .withMessage("El nombre debe contener solo letras."),
    check("apellido", "El apellido es obligatorio")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .trim()
      .matches(/.*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*/)
      .withMessage("El nombre debe contener solo letras."),
    check("email", "El email no es válido").isEmail(),
    check("password_hash", "La contraseña es obligatoria")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .trim(),
    check("imagen_url", "Seleccione una imagen").notEmpty(),
  ],
  actualizarUsuario,
);

//Eliminar un usuario
usuariosRouter.delete("/:id", validarJWT, validarRol("admin"), eliminarUsuario);
