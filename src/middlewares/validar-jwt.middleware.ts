import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("La variable JWT_SECRET no esta definida");
}

export const validarJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (typeof payload === "string" || typeof payload.id !== "string") {
      res.status(401).json({
        ok: false,
        msg: "El token no contiene un ID válido",
      });
      return;
    }
    req.id = payload.id;
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "El token no es válido",
    });
  }
};
