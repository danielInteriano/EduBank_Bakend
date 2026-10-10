import { Schema, model } from "mongoose";
import type { iUsuarioDB } from "../interfaces/usuario.interface.js";

const usuarioSchema = new Schema<iUsuarioDB>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
      trim: true,
    },
    rol: {
      type: String,
      required: true,
      default: "docente",
    },
    activo: {
      type: Boolean,
      default: true,
    },
    imagen_url: {
      type: String,
      default: "",
      trim: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    },
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, password_hash, ...rest } = ret;

        return {
          ...rest,
          id: _id.toString(),
        };
      },
    },
  },
);

const Usuario = model<iUsuarioDB>("Usuario", usuarioSchema);

export default Usuario;
