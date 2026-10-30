import { ManejarError } from "../classes/manejo-error.class.js";
import {
  ConfiguracionPdfDefault,
  type ConfiguracionPDF,
  type ConfiguracionPdfExamen,
} from "../interfaces/configuracion-pdf.interface.js";
import { Estado } from "../interfaces/examen.interface.js";
import { validarCampos } from "../middlewares/validar-campos.middleware.js";
import ConfiguracionExamenPDF from "../models/configuracion-pdf.model.js";
import { validarId } from "../utils/validar-id.js";
import { catchError } from "./catch-error.service.js";
import { validarExamen } from "./examenes.service.js";

//obtener la configuración de un examen
export const obtenerConfiguracionPdf = async (
  idUsuario: string,
  idExamen: string,
) => {
  try {
    const usuario_id = validarId(idUsuario);
    const examen_id = validarId(idExamen);

    validarExamen(usuario_id, examen_id);

    const documento = await ConfiguracionExamenPDF.findOne({
      examen_id: examen_id,
      usuario_id: usuario_id,
    }).lean();

    if (!documento) {
      throw new ManejarError("No se encontró la configuración.", 400);
    }

    return documento.configuracion || ConfiguracionPdfDefault;
  } catch (error) {
    catchError();
  }
};

//guardar la configuración de un examen
export const guardarConfiguracionPdf = async (
  idUsuario: string,
  idExamen: string,
  datos: ConfiguracionPDF,
) => {
  const usuarioId = validarId(idUsuario);
  const examenId = validarId(idExamen);
  try {
    const examen = await validarExamen(usuarioId, examenId);

    if (!examen) {
      throw new ManejarError("El examen no es válido", 400);
    }

    if (examen.estado === Estado.APLICADO) {
      throw new ManejarError(
        "No se puede modificar el diseño de un examen aplicado",
        400,
      );
    }

    const documento = await ConfiguracionExamenPDF.findOneAndUpdate(
      {
        examen_id: examenId,
        usuario_id: usuarioId,
      },
      {
        $set: { configuracion: datos },
        $setOnInsert: { examen_id: examenId, usuario_id: usuarioId },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    return documento.configuracion ?? datos;
  } catch (error) {
    catchError();
  }
};

//restablecer la configuracion de un examen
export const restablecerConfiguracionPDF = async (
  idUsuario: string,
  idExamen: string,
) => {
  try {
    const usuarioId = validarId(idUsuario);
    const examenId = validarId(idExamen);

    const examen = await validarExamen(usuarioId, examenId);

    if (!examen) {
      throw new ManejarError("Examen no valido", 400);
    }

    if (examen.estado === Estado.APLICADO) {
      throw new ManejarError("No se puede modificar un examen aplicado", 409);
    }

    await ConfiguracionExamenPDF.deleteOne({
      examen_id: examenId,
      usuario_id: usuarioId,
    });

    return ConfiguracionPdfDefault;
  } catch (error) {
    catchError();
  }
};
