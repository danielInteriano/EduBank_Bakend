import { z } from "zod";

const alineacion = z.enum(["left", "center", "right", "justify"]);

const margen = z.number().min(0).max(50);
const tamanoFuente = z.number().min(6).max(36);
const interlineado = z.number().min(0.8).max(3);

export const configuracionPdfSchema = z.strictObject({
  version: z.literal(1),

  pagina: z.strictObject({
    papel: z.enum(["LETTER", "A4"]),
    orientacion: z.enum(["portrait", "landscape"]),
    margenes: z.strictObject({
      superior: margen,
      inferior: margen,
      izquierdo: margen,
      derecho: margen,
    }),
    mostrarNumeroPagina: z.boolean(),
  }),

  encabezado: z.strictObject({
    alineacion,
    tamanoFuente: z.number().min(8).max(30),
    interlineado,
    espacioInferior: margen,
    mostrarLogo: z.boolean(),
    anchoLogo: z.number().min(10).max(150),
    altoLogo: z.number().min(10).max(150),
    mostrarCentroEducativo: z.boolean(),
    mostrarTitulo: z.boolean(),
    mostrarDatosEstudiante: z.boolean(),
    espacioEntreCampos: margen,
    bordeInferior: z.boolean(),
    paddingInferior: margen,
  }),

  preguntas: z.strictObject({
    alineacion,
    tamanoFuente,
    interlineado,
    sangriaEnunciado: margen,
    espacioAntes: margen,
    espacioDespues: margen,
    mostrarNumero: z.boolean(),
    numeroEnNegrita: z.boolean(),
    mostrarPuntuacion: z.boolean(),
    espacioDespuesPregunta: margen,
  }),

  opciones: z.strictObject({
    alineacion,
    tamanoFuente,
    interlineado,
    sangriaIzquierda: margen,
    espacioEntreOpciones: margen,
    espacioAntes: margen,
    espacioDespues: margen,
    estiloEtiqueta: z.enum(["letras", "numeros", "parentesis"]),
    etiquetaEnNegrita: z.boolean(),
  }),

  imagenPregunta: z.strictObject({
    posicion: z.enum(["right", "left", "top", "bottom"]),
    anchoMaximo: z.number().min(20).max(250),
    altoMaximo: z.number().min(20).max(250),
    anchoColumnaTexto: z.number().min(20).max(90),
    separacionColumnas: margen,
    margenSuperior: margen,
    margenInferior: margen,
    margenIzquierdo: margen,
    margenDerecho: margen,
    padding: margen,
    ajuste: z.enum(["contain", "cover"]),
    borde: z.boolean(),
    radioBorde: z.number().min(0).max(30),
  }),

  tipografia: z.strictObject({
    familia: z.enum(["Arial", "Helvetica", "Times New Roman"]),
    colorTexto: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    colorTitulos: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
});

export type ConfiguracionPdfValidada = z.infer<typeof configuracionPdfSchema>;
