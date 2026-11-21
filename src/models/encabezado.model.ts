import { Schema, Types, model } from "mongoose";
import Usuario from "./usuario.model.js";
import Signature from "./asignatura.model.js";
import type { Encabezado } from "../interfaces/encabezado.interface.js";

const EncabezadoSchema = new Schema<Encabezado>(
  {
    usuario_id: {
      type: Schema.Types.ObjectId,
      ref: Usuario,
      required: true,
      trim: true,
    },
    asignatura_id: {
      type: Schema.Types.ObjectId,
      ref: Signature,
      required: true,
      trim: true,
    },
    centro_educativo: {
      type: String,
      trim: true,
    },
    parcial: {
      type: String,
      trim: true,
    },
    valor_total: {
      type: Number,
    },
    fecha: {
      type: Date,
      required: false,
    },
    nombre_estudiante: {
      type: String,
      required: false,
      trim: true,
    },
    grado: {
      type: String,
      required: false,
      trim: true,
    },
    seccion: {
      type: Number,
    },
    periodo_academico: {
      type: Number,
      required: true,
    },
    instrucciones: {
      type: String,
      required: true,
      trim: true,
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

const EncabezadoExamen = model<Encabezado>("Encabezado", EncabezadoSchema);

export default EncabezadoExamen;
