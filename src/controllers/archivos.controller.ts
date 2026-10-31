import type { Request, Response } from "express";
import { ManejarError } from "../classes/manejo-error.class.js";
import type {
  ArchivoDB,
  TipoArchivo,
} from "../interfaces/archivo.interface.js";
import {
  guardarArchivo,
  listarArchivos,
} from "../services/archivos.service.js";

//subir el archivo de una imagen
export const subirArchivo = async (req: Request, res: Response) => {
  const idUsuario = req.id;
  try {
    if (typeof idUsuario !== "string" || !idUsuario.trim()) {
      throw new ManejarError("El id de usuario es obligatorio", 400);
    }

    if (!req.file) {
      throw new ManejarError("Faltan datos para procesar el archivo", 400);
    }

    const datos: ArchivoDB = {
      tipo: req.body.tipo,
      entidad_id: req.body.entidad_id,
      entidad_tipo: req.body.entidad_tipo,
    };

    const archivo = await guardarArchivo(idUsuario, req.file, datos);

    res.status(200).json({
      ok: true,
      msg: "Archivo subido correctamente",
      archivo,
    });
  } catch (error) {}
};

//obtener archivo de una imagen
export const obtenerArchivo = async (req: Request, res: Response) => {
  const idUsuario = req.id;
  const tiposValidos: TipoArchivo[] = ["pregunta", "logo", "predeterminada"];
  try {
    if (!idUsuario) {
      throw new ManejarError("Usuario no autenticado", 400);
    }

    const querytipo = req.query;

    if (querytipo !== undefined && typeof querytipo !== "string") {
      throw new ManejarError("Tipo de archivo no válido", 400);
    }

    if (tiposValidos.includes(querytipo as TipoArchivo)) {
      throw new ManejarError("El tipo proporcionado no es válido.", 400);
    }

    const tipo = querytipo as TipoArchivo;
    const archivos = await listarArchivos(idUsuario, tipo);

    return res.json({
      ok: true,
      total: archivos,
      archivos,
    });
  } catch (error) {}
};
