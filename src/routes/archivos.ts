import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.middleware.js";
import { validarRol } from "../middlewares/validar-rol.middleware.js";
import {
  eliminarArchivo,
  getArchivoPorId,
  getArchivoPredeterminado,
  obtenerArchivos,
  subirArchivo,
} from "../controllers/archivos.controller.js";

/*Rutas de archivos*/
export const archivosRouter = Router();

//subir el archivo de una imagen: pregunta, logo o predeterminada
archivosRouter.post("/", validarJWT, validarRol("admin"), subirArchivo);

//listar las imagenes de un usuario
//Acepta el filtro opcional ?tipo=pregunta, ?tipo=logo o ?tipo=predeterminada.
archivosRouter.get("/", validarJWT, obtenerArchivos);

//obtener la imagen predeterminada de un usuario
archivosRouter.get("/predeterminada", validarJWT, getArchivoPredeterminado);

//obtener los datos de una imagen en específico (por su id)
archivosRouter.get("/:id", validarJWT, getArchivoPorId);

//eliminar una imagen de un usuario
archivosRouter.delete("/:id", validarJWT, validarRol("admin"), eliminarArchivo);

export default archivosRouter;
