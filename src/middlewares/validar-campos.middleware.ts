import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";

export const validarCampos = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    res.status(400).json({
      ok: false,
      errores: errores.array(),
    });
    return;
  }
};
