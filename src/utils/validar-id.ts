import { Types } from "mongoose";
import { ManejarError } from "../classes/manejo-error.class.js";

export const validarId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ManejarError("El id no es válido", 400);
  }

  return new Types.ObjectId(id);
};
