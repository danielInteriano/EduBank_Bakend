//Ruta: /api/login

import { Router } from "express";
import { login, googleSignIn, renewToken } from "../controllers/auth.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.middleware.js";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";

export const router = Router();

//Iniciar sesión con usuario y contraseña
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    validarCampos,
  ],
  login,
);

//Iniciar sesión con usuario de google
router.post(
  "/google",
  [check("token", "El token es necesario.").not().isEmpty(), validarCampos],
  googleSignIn,
);

//Renovar el token de autenticación
router.get("/renew", validarJWT, renewToken);
