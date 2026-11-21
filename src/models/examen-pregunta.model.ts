import { model, Schema } from "mongoose";
import type { ExamenPregunta } from "../interfaces/examen.interface.js";

const ExamenPreguntaSchema = new Schema<ExamenPregunta>(
  {
    examen_id: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    pregunta_id: {
      type: Schema.Types.ObjectId,
      ref: "Pregunta",
      required: true,
    },
    orden: {
      type: Number,
      required: true,
      min: 1,
    },
    puntuacion: {
      type: Number,
      required: false,
      min: 0,
    },
  },
  { timestamps: true },
);

//Una pregunta no se repite dentro del mismo examen
ExamenPreguntaSchema.index({ examen_id: 1, pregunta_id: 1 }, { unique: true });

//Cada posición del examen debe ser unica
ExamenPreguntaSchema.index({ examen_id: 1, orden: 1 }, { unique: true });

const ExamenQuestion = model<ExamenPregunta>(
  "ExamenQuestion",
  ExamenPreguntaSchema,
);

export default ExamenQuestion;
