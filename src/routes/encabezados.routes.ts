//Ruta: /api/encabezados
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import {
  actualizarEncabezado,
  crearEncabezado,
  eliminarEncabezado,
  getEncabezado,
} from "../controllers/encabezado.controller.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import { check } from "express-validator";

export const encabezadosRouter = Router();

//obtener el encabezado para un examen
encabezadosRouter.get("/", validarJWT, getEncabezado);

//crear el encabezado de un examen
encabezadosRouter.post(
  "/",
  validarJWT,
  validarRol("admin"),
  [
    check("centro_educativo")
      .isString()
      .withMessage("El encabezado debe ser un texto.")
      .notEmpty()
      .withMessage("El nombre del centro educativo es obligatorio.")
      .trim(),
    check("parcial")
      .isString()
      .withMessage("El parcial debe ser un texto.")
      .notEmpty()
      .withMessage("Debe indicar el parcial.")
      .trim(),
    check("grado")
      .notEmpty()
      .withMessage("El grado debe ser un texto.")
      .notEmpty()
      .withMessage("El grado es obligatorio.")
      .trim(),
    check("seccion")
      .isNumeric()
      .withMessage("La sección debe ser un número.")
      .notEmpty()
      .withMessage("La sección es obligatoria.")
      .trim(),
    check("instrucciones")
      .isString()
      .withMessage("Las instrucciones deben ser un texto.")
      .notEmpty()
      .withMessage("Las instrucciones son obligatorias.")
      .trim(),
  ],
  crearEncabezado,
);

//actualizar los datos de un encabezado
encabezadosRouter.patch(
  "/id:",
  validarJWT,
  validarRol("admin"),
  [
    check("centro_educativo")
      .isString()
      .withMessage("El encabezado debe ser un texto.")
      .notEmpty()
      .withMessage("El nombre del centro educativo es obligatorio.")
      .trim(),
    check("parcial")
      .isString()
      .withMessage("El parcial debe ser un texto.")
      .notEmpty()
      .withMessage("Debe indicar el parcial.")
      .trim(),
    check("grado")
      .notEmpty()
      .withMessage("El grado debe ser un texto.")
      .notEmpty()
      .withMessage("El grado es obligatorio.")
      .trim(),
    check("seccion")
      .isNumeric()
      .withMessage("La sección debe ser un número.")
      .notEmpty()
      .withMessage("La sección es obligatoria.")
      .trim(),
    check("instrucciones")
      .isString()
      .withMessage("Las instrucciones deben ser un texto.")
      .notEmpty()
      .withMessage("Las instrucciones son obligatorias.")
      .trim(),
  ],
  actualizarEncabezado,
);

//eliminar el encabezado de un examen cambiando su estado "activo" a "false"
encabezadosRouter.delete(
  "/:id",
  validarJWT,
  validarRol("admin"),
  eliminarEncabezado,
);
