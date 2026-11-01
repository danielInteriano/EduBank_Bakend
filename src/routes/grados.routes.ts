import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import {
  actualizarGrado,
  cambiarEstadoGrado,
  crearGrado,
  getGrado,
  getGrados,
} from "../controllers/grados.controller.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";

export const gradosRouter = Router();

/*Rutas de grados*/

//obtener un grado por su id
gradosRouter.get("/:id", validarJWT, getGrado);

//obtener todos los grados con estado activo
gradosRouter.get("/", validarJWT, getGrados);

//crear un grado
gradosRouter.post("/", validarJWT, validarRol("admin"), crearGrado);

//actualizar los componentes de un grado
gradosRouter.put("/:id", validarJWT, validarRol("admin"), actualizarGrado);

//actualizar es estado de un grado
gradosRouter.patch("/:id", validarJWT, validarRol("admin"), cambiarEstadoGrado);
