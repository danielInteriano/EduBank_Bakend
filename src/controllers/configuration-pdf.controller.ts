import type { Request, Response } from "express";
import { catchError } from "../services/catch-error.service.js";
import { ManejarError } from "../classes/manejo-error.class.js";
import {
  guardarConfiguracionPdf,
  obtenerConfiguracionPdf,
  restablecerConfiguracionPDF,
} from "../services/configuration-pdf.service.js";
import { configuracionPdfSchema } from "../validators/configuracion-pdf.validator.js";

//función para obtener la configuración de un examen
export const getConfiguracion = async (req: Request, res: Response) => {
  const idUsuario = req.id;
  const idExamen = req.params.id;
  try {
    if (typeof idUsuario !== "string" || !idUsuario.trim()) {
      throw new ManejarError("El id de usuario es obligatorio", 400);
    }

    if (typeof idExamen !== "string" || !idUsuario.trim()) {
      throw new ManejarError("El id del examen es obligatorio", 400);
    }

    const configuracion = obtenerConfiguracionPdf(idUsuario, idExamen);

    return res.status(200).json({
      ok: true,
      configuracion,
    });
  } catch (error) {
    catchError();
  }
};

//función para guardar la configuracion de un examen
export const guardarConfiguracion = async (req: Request, res: Response) => {
  const idUsuario = req.id;
  const idExamen = req.params.id;
  try {
    if (typeof idUsuario !== "string" || idUsuario.trim()) {
      throw new ManejarError("El id de usuario es obligatorio", 400);
    }

    if (typeof idExamen !== "string" || idExamen.trim()) {
      throw new ManejarError("El id del examen es obligatorio", 400);
    }

    const validacion = configuracionPdfSchema.safeParse(req.body);

    if (!validacion.success) {
      throw new ManejarError(
        "La configuración contiene valores inválidos",
        400,
      );
    }

    const configuracion = await guardarConfiguracionPdf(
      idUsuario,
      idExamen,
      validacion.data,
    );

    return res.status(200).json({
      ok: true,
      msg: "Configuración guardada.",
      configuracion,
    });
  } catch (error) {
    catchError();
  }
};

//función para restablecer la configuracion de un examen
export const restablecerConfiguracion = async (req: Request, res: Response) => {
  const idUsuario = req.id;
  const idExamen = req.params.id;

  try {
    if (typeof idUsuario !== "string" || idUsuario.trim()) {
      throw new ManejarError("El id de usuario es obligatorio", 400);
    }

    if (typeof idExamen !== "string" || idExamen.trim()) {
      throw new ManejarError("El id del examen es obligatorio", 400);
    }

    const configuracion = await restablecerConfiguracionPDF(
      idUsuario,
      idExamen,
    );

    return res.status(200).json({
      ok: true,
      msg: "Configuracion restablecida.",
      configuracion,
    });
  } catch (error) {
    catchError();
  }
};
