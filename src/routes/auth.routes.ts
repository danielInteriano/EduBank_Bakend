//Ruta: /api/login

import { Router } from "express";
import {
  login,
  googleSignIn,
  renewToken,
} from "../controllers/auth.controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.middleware.js";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";

export const authRouter = Router();

//Iniciar sesión con usuario y contraseña
authRouter.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria")
      .notEmpty()
      .withMessage("La contraseña no puede estar vacía."),
    validarCampos,
  ],
  login,
);

//Iniciar sesión con usuario de google
authRouter.post(
  "/google",
  [check("token", "El token es necesario.").not().isEmpty(), validarCampos],
  googleSignIn,
);

//Renovar el token de autenticación
authRouter.get("/renew", validarJWT, renewToken);
