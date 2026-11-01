import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import {
  agregarOpcion,
  getPregunta,
  getPreguntasSeleccionadas,
} from "../controllers/preguntas.controller.js";
import {
  actualizarAsignatura,
  crearAsignatura,
  eliminarAsignatura,
} from "../controllers/asignaturas.controller.js";
import { check } from "express-validator";

export const preguntasRouter = Router();

//obtener un tema
preguntasRouter.get("/id:", validarJWT, getPregunta);

//obtener todas las preguntas seleccionadas
preguntasRouter.get("/preguntas", validarJWT, getPreguntasSeleccionadas);

//crear una pregunta
preguntasRouter.post(
  "/",
  validarJWT,
  validarRol("admin"),
  [
    check("usuario_id")
      .notEmpty()
      .withMessage("El id de usuario es obligatorio.")
      .isMongoId()
      .withMessage("El id de usuario no es válido."),
    check("asignatura_id")
      .notEmpty()
      .withMessage("El id de la asignatura es obligatorio.")
      .isMongoId()
      .withMessage("El id de la asignatura no es válido."),
    check("bloque_id")
      .notEmpty()
      .withMessage("El id del bloque es obligatorio.")
      .isMongoId()
      .withMessage("El id del bloque no es válido."),
    check("tema_id")
      .notEmpty()
      .withMessage("El id de usuario es obligatorio.")
      .isMongoId()
      .withMessage("El id de usuario no es válido."),
    check("tipo")
      .notEmpty()
      .withMessage("Especificar el tipo de pregunta es obligatorio."),
    check("enunciado")
      .notEmpty()
      .withMessage("El enunciado de la pregunta es obligatorio."),
    check("puntuacion")
      .notEmpty()
      .withMessage("El puntaje de la pregunta es obligatorio.")
      .isNumeric()
      .withMessage("El puntaje debe ser un número."),
  ],
  crearAsignatura,
);

//actualizar una pregunta
preguntasRouter.patch(
  "/id:",
  validarJWT,
  validarRol("admin"),
  [
    check("usuario_id")
      .notEmpty()
      .withMessage("El id de usuario es obligatorio.")
      .isMongoId()
      .withMessage("El id de usuario no es válido."),
    check("asignatura_id")
      .notEmpty()
      .withMessage("El id de la asignatura es obligatorio.")
      .isMongoId()
      .withMessage("El id de la asignatura no es válido."),
    check("bloque_id")
      .notEmpty()
      .withMessage("El id del bloque es obligatorio.")
      .isMongoId()
      .withMessage("El id del bloque no es válido."),
    check("tema_id")
      .notEmpty()
      .withMessage("El id de usuario es obligatorio.")
      .isMongoId()
      .withMessage("El id de usuario no es válido."),
    check("tipo")
      .notEmpty()
      .withMessage("Especificar el tipo de pregunta es obligatorio."),
    check("enunciado")
      .notEmpty()
      .withMessage("El enunciado de la pregunta es obligatorio."),
    check("puntuacion")
      .notEmpty()
      .withMessage("El puntaje de la pregunta es obligatorio.")
      .isNumeric()
      .withMessage("El puntaje debe ser un número."),
  ],
  actualizarAsignatura,
);

//eliminar una pregunta cambiando su estado activo "true" a "false"
preguntasRouter.delete(
  "/id:",
  validarJWT,
  validarRol("admin"),
  eliminarAsignatura,
);

//agregar opciones a una pregunta del tipo: SELECCION_UNICA o SELECCION_MULTIPLE
preguntasRouter.put(
  "/:idPregunta/opciones",
  validarJWT,
  validarRol("admin"),
  agregarOpcion,
);
