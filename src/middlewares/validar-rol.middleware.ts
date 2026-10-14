import type { Request, Response, NextFunction } from "express";
import Usuario from "../models/usuario.model.js";
import { buscarUsuarioPorId } from "../services/usuario.service.js";
import { catchError } from "../services/catch-error.service.js";

export const validarRol = (...rolesPermitidos: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.id) {
      return res.status(401).json({
        ok: false,
        msg: "No se ha identificado al usuario",
      });
    }

    try {
      const usuario = await buscarUsuarioPorId(req.id);

      if (!usuario || !usuario.activo) {
        return res.status(401).json({
          ok: false,
          msg: "Usuario no encontrado o inactivo",
        });
      }

      if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({
          ok: false,
          msg: "No tienes permisos para realizar esta operación",
        });
      }

      return next();
    } catch (error) {
      catchError();
    }
  };
};
