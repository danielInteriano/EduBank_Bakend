import { model, Schema, Types } from "mongoose";
import { Estado, type Examen } from "../interfaces/examen.interface.js";

const ExamenSchema = new Schema<Examen>(
  {
    usuario_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El id de usuario es obligatorio."],
    },
    encabezado_id: {
      type: Schema.Types.ObjectId,
      ref: "EncamezadoExamen",
      required: [true, "El id del encabezado es obligatorio."],
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: String,
      enum: Object.values(Estado),
      default: Estado.BORRADOR,
      required: true,
    },
    cantidad_preguntas: {
      type: Number,
      required: true,
      min: 1,
    },
    puntuacion_total: {
      type: Number,
      required: true,
      min: 0,
    },
    descripcion: {
      type: String,
      required: false,
      trim: true,
    },
    pdf_url: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "fecha_generación",
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

const Exam = model<Examen>("Exam", ExamenSchema);

export default Exam;
