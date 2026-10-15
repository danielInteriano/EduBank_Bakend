import { Schema, model } from "mongoose";
import type { Bloque } from "../interfaces/bloque.interface.js";

const BloqueSchema = new Schema<Bloque>(
  {
    asignatura_id: {
      type: Schema.Types.ObjectId,
      ref: "Signature",
      required: [true, "La asignatura es obligatoria"],
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    orden: {
      type: Number,
      required: true,
    },
    activo: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    },
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, ...rest } = ret;

        return {
          ...rest,
          id: _id.toString(),
        };
      },
    },
  },
);

const BBloque = model<Bloque>("Bloque", BloqueSchema);

export default BBloque;
