//Ruta: /api/asignaturas

import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import {
  actualizarAsignatura,
  crearAsignatura,
  eliminarAsignatura,
  getAsignatura,
  getAsignaturas,
  getAsignaturasSeleccionadas,
} from "../controllers/asignaturas.controller.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import { check } from "express-validator";

export const asignaturasRouter = Router();

//obtener una asignatura por su id
asignaturasRouter.get("/:id", validarJWT, getAsignatura);

//obtener todas las asignaturas
asignaturasRouter.get("/", validarJWT, getAsignaturas);

//obtener un conjunto de asignaturas seleccionadas
asignaturasRouter.get(
  "/seleccionadas",
  validarJWT,
  getAsignaturasSeleccionadas,
);

//crear una nueva asignatura
asignaturasRouter.post(
  "/",
  validarJWT,
  validarRol("admin"),
  [
    check("nombre")
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
    check("orden")
      .notEmpty()
      .withMessage("La orden no puede estar vacío.")
      .isNumeric()
      .withMessage("El orden debe ser un número"),
  ],
  crearAsignatura,
);

//actualizar los campos de una asignatura
asignaturasRouter.patch(
  "/:id",
  validarJWT,
  validarRol("admin"),
  [
    check("nombre", "El nobre es obligatorio.")
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
  ],
  actualizarAsignatura,
);

//eliminar una asignatura
asignaturasRouter.delete(
  "/:id",
  validarJWT,
  validarRol("admin"),
  eliminarAsignatura,
);
