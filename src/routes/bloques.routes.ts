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
  validarJWT,
  validarRol("admin"),
  crearBloque,
);

//actualizar un bloque
bloquesRouter.patch(
  "/:id",
  [
    check("nombre", "El nombre es obligatorio")
      .optional()
      .isString()
      .withMessage("El nombre debe ser texto.")
      .trim()
      .matches(/.*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*/)
      .withMessage("El nombre debe contener al menos una letra."),
    check("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto.")
      .trim()
      .isLength({ max: 300 })
      .withMessage("La descripción no puede superar los 300 caracteres."),
    check("asignatura_id")
      .optional()
      .isMongoId()
      .withMessage("El ID de la asignatura no es válido"),
  ],
  validarJWT,
  validarRol("admin"),
  actualizarBloque,
);

//eliminar un bloque cambiando su estado "activo" a false
bloquesRouter.delete("/:id", validarJWT, validarRol("admin"), eliminarBloque);
