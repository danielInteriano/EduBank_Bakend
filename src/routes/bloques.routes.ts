//Ruta: /api/bloques

import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import {
  actualizarBloque,
  crearBloque,
  eliminarBloque,
  getBloque,
  getBloques,
  getTemasPorBloque,
} from "../controllers/boques.controller.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import { check } from "express-validator";

export const bloquesRouter = Router();

//obtener un bloque
bloquesRouter.get("/:id", validarJWT, getBloque);

//obtener todos los bloques
bloquesRouter.get("/", validarJWT, getBloques);

//obtener todos los temas de un bloque
bloquesRouter.get("/:idBloque/temas", validarJWT, getTemasPorBloque);

//crear un bloque
bloquesRouter.post(
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
    check("asignatura_id")
      .notEmpty()
      .withMessage("La asignatura es obligatoria")
      .isMongoId()
      .withMessage("El ID de la asignatura no es válido"),
  ],
  crearBloque,
);

//actualizar un bloque
bloquesRouter.patch(
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
    check("asignatura_id")
      .notEmpty()
      .withMessage("La asignatura es obligatoria")
      .isMongoId()
      .withMessage("El ID de la asignatura no es válido"),
  ],
  actualizarBloque,
);

//eliminar un bloque cambiando su estado "activo" a false
bloquesRouter.delete("/:id", validarJWT, validarRol("admin"), eliminarBloque);
