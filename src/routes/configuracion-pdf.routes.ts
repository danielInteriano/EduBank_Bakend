import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import {
  getConfiguracion,
  guardarConfiguracion,
  restablecerConfiguracion,
} from "../controllers/configuration-pdf.controller.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";

export const configuracionRouter = Router();

//obtener la configuracion de un examen
configuracionRouter.get("/:id/configuracion-pdf", validarJWT, getConfiguracion);

//guardar la configuracion de un examen
configuracionRouter.post(
  "/:id/configuracion-pdf",
  validarJWT,
  validarRol("admin"),
  guardarConfiguracion,
);

//restablecer la configuracion PDF de un examen
configuracionRouter.delete(
  "/:id/configuracion-pdf",
  validarJWT,
  validarRol("admin"),
  restablecerConfiguracion,
);
