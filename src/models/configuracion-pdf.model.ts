import { model, Schema } from "mongoose";
import type { ConfiguracionPdfExamen } from "../interfaces/configuracion-pdf.interface.js";

const ConfiguracionPdfSchema = new Schema<ConfiguracionPdfExamen>(
  {
    examen_id: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      unique: true,
    },

    usuario_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },

    configuracion: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

const ConfiguracionExamenPDF = model<ConfiguracionPdfExamen>(
  "ConfiguracionExamenPDF",
  ConfiguracionPdfSchema,
);

export default ConfiguracionExamenPDF;
