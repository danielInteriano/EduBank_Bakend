import { model, Schema } from "mongoose";
import type { Grado } from "../interfaces/grado.interface.js";

const GradoSchema = new Schema<Grado>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    orden: {
      type: Number,
      required: true,
      min: 1,
      unique: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Grade = model<Grado>("Grado", GradoSchema);

export default Grade;
