//Ruta: /api/temas
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import { check } from "express-validator";
import {
  actualizarTema,
  crearTema,
  eliminarTema,
  getPreguntasPorTema,
  getTema,
  getTemas,
} from "../controllers/tema.controller.js";

export const temasRouter = Router();

//obtener un tema
temasRouter.get("/:id", validarJWT, getTema);

//obtener todos los temas
temasRouter.get("/", validarJWT, getTemas);

//obtener todas las preguntas de un tema
//PENDIENTE
temasRouter.get("/:idTema/preguntas", validarJWT, getPreguntasPorTema);

//crear un tema
temasRouter.post(
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
      .isLength({ max: 300 })
      .withMessage("La descripción no puede superar los 300 caracteres."),
    check("bloque_id")
      .notEmpty()
      .withMessage("El bloque es obligatorio.")
      .isMongoId()
      .withMessage("El ID del bloque no es válido"),
  ],
  validarJWT,
  validarRol("admin"),
  crearTema,
);

//actualizar un bloque
temasRouter.patch(
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
    check("bloque_id")
      .notEmpty()
      .withMessage("El bloque es obligatorio.")
      .isMongoId()
      .withMessage("El ID del bloque no es válido"),
  ],
  validarJWT,
  validarRol("admin"),
  actualizarTema,
);

//eliminar un bloque cambiando su estado "activo" a false
temasRouter.delete("/:id", validarJWT, validarRol("admin"), eliminarTema);
