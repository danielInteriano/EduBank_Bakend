import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import {
  actualizarExamen,
  crearExamen,
  eliminarExamen,
  getExamen,
  getExamenes,
} from "../controllers/examenes.controller.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import { check } from "express-validator";

export const examenesRouter = Router();

//obtener un examen
examenesRouter.get("/", validarJWT, getExamen);

//obtener todos los examenes para poder mostrarlos
examenesRouter.get("/examenes", validarJWT, getExamenes);

//crear un examen
examenesRouter.post(
  "/",
  validarJWT,
  validarRol("admin"),
  [
    check("titulo")
      .isString()
      .withMessage("El título del examen debe ser un texto.")
      .notEmpty()
      .withMessage("El título del examen no puede estar vacío.")
      .trim(),
    check("cantidad_preguntas")
      .isNumeric()
      .withMessage("El número de preguntas debe ser un número.")
      .notEmpty()
      .withMessage("El examen debe tener preguntas."),
    check("descripcion")
      .isString()
      .withMessage("El título del examen debe ser un texto.")
      .notEmpty()
      .withMessage("El título del examen no puede estar vacío.")
      .trim(),
    check("pdf_url")
      .isString()
      .withMessage("El título del examen debe ser un texto.")
      .notEmpty()
      .withMessage("El título del examen no puede estar vacío.")
      .trim(),
    check("puntuacion_total")
      .isNumeric()
      .withMessage("El valor del examen debe ser un número.")
      .notEmpty()
      .withMessage("El valor del examen no puede ser nulo"),
  ],
  crearExamen,
);

//actualizar un examen
examenesRouter.patch(
  "/:id",
  validarJWT,
  validarRol("admin"),
  [
    check("titulo")
      .isString()
      .withMessage("El título del examen debe ser un texto.")
      .notEmpty()
      .withMessage("El título del examen no puede estar vacío.")
      .trim(),
    check("cantidad_preguntas")
      .isNumeric()
      .withMessage("El número de preguntas debe ser un número.")
      .notEmpty()
      .withMessage("El examen debe tener preguntas."),
    check("descripcion")
      .isString()
      .withMessage("El título del examen debe ser un texto.")
      .notEmpty()
      .withMessage("El título del examen no puede estar vacío.")
      .trim(),
    check("pdf_url")
      .isString()
      .withMessage("El título del examen debe ser un texto.")
      .notEmpty()
      .withMessage("El título del examen no puede estar vacío.")
      .trim(),
    check("puntuacion_total")
      .isNumeric()
      .withMessage("El valor del examen debe ser un número.")
      .notEmpty()
      .withMessage("El valor del examen no puede ser nulo"),
  ],
  actualizarExamen,
);

//eliminar un examen
examenesRouter.delete("/:id", validarJWT, validarRol("admin"), eliminarExamen);
