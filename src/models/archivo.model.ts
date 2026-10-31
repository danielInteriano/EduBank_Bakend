import { model, Schema } from "mongoose";
import type { Archivo } from "../interfaces/archivo.interface.js";

const ArchivoSchema = new Schema<Archivo>(
  {
    usuario_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },
    tipo: {
      type: String,
      enum: ["logo", "pregunta", "predeterminada"],
      required: true,
    },
    entidad_tipo: {
      type: String,
      enum: ["pregunta", "encabezado", "usuario"],
      required: false,
    },
    nombre_original: {
      type: String,
      required: true,
      trim: true,
    },
    nombre_archivo: {
      type: String,
      required: true,
      unique: true,
    },
    ruta: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mime_tipo: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    tamanio: {
      type: Number,
      required: true,
      min: 1,
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
    versionKey: false,
  },
);

//Imagen predeterminada para el usuario
ArchivoSchema.index(
  { usuario_id: 1, tipo: 1 },
  {
    unique: true,
    partialFilterExpression: {
      tipo: "predeterminada",
    },
  },
);

//Manejo facil de las consultas de imagenes por entidad
ArchivoSchema.index({ usuario_id: 1, entidad_id: 1, entidad_tipo: 1 });

const Archive = model<Archivo>("Archivo", ArchivoSchema);

export default Archive;
