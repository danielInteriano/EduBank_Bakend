import { Schema, Types, model } from "mongoose";
import {
  NivelDificultad,
  TipoPregunta,
  type Pregunta,
} from "../interfaces/pregunta.interface.js";

const Opcion = new Schema(
  {
    opcion: {
      type: String,
      required: true,
      trim: true,
    },
    esCorrecta: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
);

const Par = new Schema({
  izquierda: {
    type: String,
    required: true,
    trim: true,
  },
  derecha: {
    type: String,
    required: true,
    trim: true,
  },
});

const PreguntaSchema = new Schema<Pregunta>(
  {
    usuario_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El id de usuario es obligatorio."],
    },
    asignatura_id: {
      type: Schema.Types.ObjectId,
      ref: "Signature",
      required: [true, "El id de la asignatura es obligatorio."],
    },
    bloque_id: {
      type: Schema.Types.ObjectId,
      ref: "Bloque",
      required: [true, "El id del bloque es obligatorio."],
    },
    tema_id: {
      type: Schema.Types.ObjectId,
      ref: "TTema",
      required: [true, "El id del tema es obligatorio."],
    },
    grado_id: {
      type: Schema.Types.ObjectId,
      ref: "Grado",
      required: true,
      index: true,
    },
    tipo: {
      type: String,
      enum: Object.values(TipoPregunta),
      required: true,
    },
    enunciado: {
      type: String,
      required: true,
      trim: true,
    },
    respuesta_correcta: {
      type: Schema.Types.Mixed,
      validate: {
        validator: (valor: unknown) =>
          typeof valor === "string" || typeof valor === "boolean",
        message: "La respuesta correcta debe ser texto o booleano",
      },
    },
    opciones: {
      type: [Opcion],
      default: undefined,
    },
    pares: {
      type: [Par],
      default: undefined,
    },
    puntuacion: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    imagen_url: {
      type: String,
      trim: true,
    },
    explicacion: {
      type: String,
      trim: true,
    },
    dificultad: {
      type: String,
      enum: Object.values(NivelDificultad),
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

const Question = model<Pregunta>("Pregunta", PreguntaSchema);

export default Question;
