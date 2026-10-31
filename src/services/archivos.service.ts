import path from "node:path";
import { ManejarError } from "../classes/manejo-error.class.js";
import type {
  Archivo,
  ArchivoDB,
  TipoArchivo,
  TipoEntidad,
} from "../interfaces/archivo.interface.js";
import { validarId } from "../utils/validar-id.js";
import { fileTypeFromBuffer } from "file-type";
import { catchError } from "./catch-error.service.js";
import { Types } from "mongoose";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import Archive from "../models/archivo.model.js";
import { any } from "zod";

const MAX_TAM = 5 * 1024 * 1024;
const DIRECTORIO = path.resolve("uploads");
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

//obtener un archivo por su id
export const burcarArchivoPorId = async (
  idUsuario: string,
  idArchivo: string,
): Promise<Archivo> => {
  const usuarioId = validarId(idUsuario);
  const archivoId = validarId(idArchivo);

  try {
    if (!Types.ObjectId.isValid(archivoId)) {
      throw new ManejarError("El id del archivo no es válido.", 400);
    }

    const archivo = await Archive.findOne({
      _id: archivoId,
      usuario_id: usuarioId,
    }).lean();

    if (!archivo) {
      throw new ManejarError("No se encontró el archivo.", 404);
    }

    return archivo;
  } catch (error) {
    catchError();
    throw error;
  }
};

//función para guardar un archivo de imagen
export const guardarArchivo = async (
  idUsuario: string,
  file: Express.Multer.File,
  datos: ArchivoDB,
): Promise<Archivo> => {
  let rutaArchivo: string | undefined;
  const tipoEntidad = ["pregunta", "logo", "predeterminada"];
  try {
    const usuarioId = validarId(idUsuario);

    if (!file) {
      throw new ManejarError("Archivo no enviado.", 400);
    }

    if (file.size > MAX_TAM) {
      throw new ManejarError("El archivo excede el tamaño permitido.", 400);
    }

    const tipoReal = await fileTypeFromBuffer(file.buffer);

    if (!tipoReal || !TIPOS_PERMITIDOS.includes(tipoReal.mime)) {
      throw new ManejarError("El formato de imagen no está permitido.", 400);
    }

    if (!tipoEntidad.includes(datos.tipo)) {
      throw new ManejarError("El tipo de archivo no es válido.", 400);
    }

    //validamos la relación entre el tipo de archivo y entidad
    if (datos.tipo === "pregunta" || datos.tipo === "logo") {
      if (!datos.entidad_id || !Types.ObjectId.isValid(datos.entidad_id)) {
        throw new ManejarError("Debe brindar un id válido.", 400);
      }
    }

    const entidadEsperada =
      datos.tipo === "pregunta" ? "pregunta" : "encabezado";

    if (datos.entidad_tipo !== entidadEsperada) {
      throw new ManejarError(
        "La entidad no corresponde al tipo de archivo.",
        400,
      );
    }

    //creacion de la url del archivo
    await mkdir(DIRECTORIO, { recursive: true });
    const nombreArchivo = `${randomUUID}.${tipoReal.ext}`;
    rutaArchivo = path.join(DIRECTORIO, nombreArchivo);
    await writeFile(rutaArchivo, file.buffer, { flag: "wx" });
    const url = `/uploads/${nombreArchivo}`;

    //validacion del id de la entidad enviada
    if (!datos.entidad_id) {
      throw new ManejarError("El id de la entidad es obligatorio.", 400);
    }

    const nuevoArchivo = await Archive.create({
      usuario_id: new Types.ObjectId(usuarioId),
      tipo: datos.tipo,
      entidad_id: validarId(datos.entidad_id),
      entidad_tipo: datos.entidad_tipo,
      nombre_original: path.basename(file.originalname),
      nombre_archivo: nombreArchivo,
      ruta: rutaArchivo,
      url,
      mime_tipo: tipoReal.mime,
      extension: tipoReal.ext,
      tamanio: file.size,
    });

    //Si hay una imagen previa, se reempla por la nueva.
    if (datos.tipo === "predeterminada") {
      const anteriores = Archive.find({
        usuario_id: usuarioId,
        tipo: "predeterminada",
        _id: { $ne: nuevoArchivo._id },
      });

      for (const anterior of await anteriores) {
        await Archive.deleteOne({ _id: anterior._id });
        await eliminarArchivoFisico(anterior.ruta);
      }
    }

    return nuevoArchivo.toObject();
  } catch (error) {
    if (rutaArchivo) {
      await eliminarArchivoFisico(rutaArchivo);
    }
    throw error;
  }
};

//función para eliminar un archivo en físico
export const eliminarArchivoFisico = async (ruta: string): Promise<void> => {
  try {
    await unlink(ruta);
  } catch (error) {
    const codigo = (error as NodeJS.ErrnoException).code;
    if (codigo !== "ENOENT") {
      catchError();
    }
  }
};

//función para listar un conjunto de archivos.
export const listarArchivos = async (
  idUsuario: string,
  tipo: TipoArchivo,
): Promise<Archivo[]> => {
  const usuarioId = validarId(idUsuario);
  const tiposPermitidos = ["pregunta", "logo", "predeterminada"];
  const filtro: Record<string, unknown> = {
    usuario_id: usuarioId,
  };

  if (tipo) {
    if (!tiposPermitidos.includes(tipo)) {
      throw new ManejarError("Tipo de archivo no válido", 400);
    }
    filtro.tipo = tipo;
  }

  return await Archive.find(filtro).sort({ createAt: -1 }).lean();
};

//función para obtener la imagen predeterminada de una entidad
export const buscarImagenPredeterminada = async (
  idUsuario: string,
): Promise<Archivo | null> => {
  const usuarioId = validarId(idUsuario);
  try {
    const archivo = await Archive.findOne({
      usuario_id: usuarioId,
      tipo: "predeterminada",
    }).lean();

    return archivo;
  } catch (error) {
    catchError();
    throw error;
  }
};

//función para eliminar un archivo
export const borrarArchivo = async (
  idUsuario: string,
  idArchivo: string,
): Promise<void> => {
  const usuarioId = validarId(idUsuario);
  const archivoId = validarId(idArchivo);

  try {
    if (!Types.ObjectId.isValid(archivoId)) {
      throw new ManejarError("El id del archivo no es válido.", 400);
    }

    const archivo = await Archive.findOne({
      _id: archivoId,
      usuario_id: usuarioId,
    });

    if (!archivo) {
      throw new ManejarError("Archivo no encontrado.", 404);
    }

    await archivo.deleteOne({
      _id: archivo._id,
    });

    await eliminarArchivoFisico(archivo.ruta);
  } catch (error) {
    catchError();
  }
};
