//Ruta: /api/temas
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import { check } from "express-validator";
import {
  actualizarTema,
  crearTema,
  eliminarTema,
  getTema,
  getTemas,
} from "../controllers/tema.controller.js";

export const temasRouter = Router();

//obtener un tema
temasRouter.get("/:id", validarJWT, getTema);

//obtener todos los temas
temasRouter.get("/", validarJWT, getTemas);

//crear un tema
temasRouter.post(
  "/",
  validarJWT,
  validarRol("admin"),
  [
    check("nombre", "El nombre es obligatorio")
      .isString()
      .withMessage("El nombre debe ser texto.")
      .trim()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .matches(/.*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*/)
      .withMessage("El nombre debe contener al menos una letra."),
    check("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto.")
      .trim()
      .notEmpty()
      .withMessage("La descripción no puede estar vacía.")
      .isLength({ max: 300 })
      .withMessage("La descripción no puede superar los 300 caracteres."),
    check("bloque_id")
      .notEmpty()
      .withMessage("El bloque es obligatorio.")
      .isMongoId()
      .withMessage("El ID del bloque no es válido"),
  ],
  crearTema,
);

//actualizar un bloque
temasRouter.patch(
  "/:id",
  validarJWT,
  validarRol("admin"),
  [
    check("nombre", "El nombre es obligatorio")
      .isString()
      .withMessage("El nombre debe ser texto.")
      .trim()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .matches(/.*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*/)
      .withMessage("El nombre debe contener al menos una letra."),
    check("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto.")
      .trim()
      .notEmpty()
      .withMessage("La descripción no puede estar vacía.")
      .isLength({ max: 300 })
      .withMessage("La descripción no puede superar los 300 caracteres."),
    check("bloque_id")
      .notEmpty()
      .withMessage("El bloque es obligatorio.")
      .isMongoId()
      .withMessage("El ID del bloque no es válido"),
  ],
  actualizarTema,
);

//eliminar un bloque cambiando su estado "activo" a false
temasRouter.delete("/:id", validarJWT, validarRol("admin"), eliminarTema);
