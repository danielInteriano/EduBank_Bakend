import { Schema, model } from "mongoose";
import type { Tema } from "../interfaces/tema.interface.js";

const TemaSchema = new Schema<Tema>(
  {
    bloque_id: {
      type: Schema.Types.ObjectId,
      ref: "Bloque",
      required: [true, "El bloque es obligatorio."],
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

const TTema = model<Tema>("Bloque", TemaSchema);

export default TTema;
