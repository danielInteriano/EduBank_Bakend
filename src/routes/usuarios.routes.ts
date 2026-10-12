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
import { actualizandoCampos } from "../services/usuario.service.js";

export const router = Router();

/*Rutas de usuarios*/

//Obtener un usuario por su email
router.get("/:email", validarJWT, getUsuario);

//Obtener un usuario por su id
router.get("/usuario/:id", validarJWT, getUsuarioById);

//Obtener todos los usuarios, de 7 en 7 para paginación
router.get("/", validarJWT, getUsuarios);

//Crear un usuario
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("apellido", "El apellido es obligatorio").notEmpty(),
    check("email", "El email no es válido").isEmail(),
    check("password_hash", "La contraseña es obligatoria").notEmpty(),
    check("imagen_url", "Seleccione una imagen").notEmpty(),
    validarCampos,
  ],
  crearUsuario,
);

//Actualizar ciertos atributos de un usuario
router.patch(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("apellido", "El apellido es obligatorio").notEmpty(),
    check("email", "El email no es válido").isEmail(),
    check("password_hash", "La contraseña es obligatoria").notEmpty(),
    check("imagen_url", "Seleccione una imagen").notEmpty(),
  ],
  actualizarUsuario,
);

//Eliminar un usuario
router.delete("/:id", validarJWT, eliminarUsuario);
