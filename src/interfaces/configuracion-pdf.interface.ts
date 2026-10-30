import type { Types } from "mongoose";

export type Alineacion = "left" | "center" | "right" | "justify";
export type PosicionImagen = "right" | "left" | "top" | "bottom";
export type Tamano = "LETTER" | "A4";
export type Orientacion = "portrait" | "landscape";
export type EstiloEtiqueta = "letras" | "numeros" | "parentesis";
export type AjusteImagen = "contain" | "cover";
export type FontFamily = "Arial" | "Helvetica" | "Times New Roman";

export interface ConfiguracionPDF {
  version: number;
  pagina: {
    papel: Tamano;
    orientacion: Orientacion;
    margenes: {
      superior: number;
      inferior: number;
      izquierdo: number;
      derecho: number;
    };
    mostrarNumeroPagina: boolean;
  };

  encabezado: {
    alineacion: Alineacion;
    tamanoFuente: number;
    interlineado: number;
    espacioInferior: number;

    mostrarLogo: boolean;
    anchoLogo: number;
    altoLogo: number;

    mostrarCentroEducativo: boolean;
    mostrarTitulo: boolean;
    mostrarDatosEstudiante: boolean;

    espacioEntreCampos: number;
    bordeInferior: boolean;
    paddingInferior: number;
  };

  preguntas: {
    alineacion: Alineacion;
    tamanoFuente: number;
    interlineado: number;

    sangriaEnunciado: number;
    espacioAntes: number;
    espacioDespues: number;

    mostrarNumero: boolean;
    numeroEnNegrita: boolean;
    mostrarPuntuacion: boolean;

    espacioDespuesPregunta: number;
  };

  opciones: {
    alineacion: Alineacion;
    tamanoFuente: number;
    interlineado: number;

    sangriaIzquierda: number;
    espacioEntreOpciones: number;
    espacioAntes: number;
    espacioDespues: number;

    estiloEtiqueta: EstiloEtiqueta;
    etiquetaEnNegrita: boolean;
  };

  imagenPregunta: {
    posicion: PosicionImagen;
    anchoMaximo: number;
    altoMaximo: number;

    anchoColumnaTexto: number;
    separacionColumnas: number;

    margenSuperior: number;
    margenInferior: number;
    margenIzquierdo: number;
    margenDerecho: number;

    padding: number;
    ajuste: AjusteImagen;
    borde: boolean;
    radioBorde: number;
  };

  tipografia: {
    familia: FontFamily;
    colorTexto: string;
    colorTitulos: string;
  };
}

export const ConfiguracionPdfDefault: ConfiguracionPDF = {
  version: 1,

  pagina: {
    papel: "LETTER",
    orientacion: "portrait",
    margenes: {
      superior: 18,
      inferior: 18,
      izquierdo: 20,
      derecho: 20,
    },
    mostrarNumeroPagina: true,
  },

  encabezado: {
    alineacion: "center",
    tamanoFuente: 14,
    interlineado: 1.3,
    espacioInferior: 18,
    mostrarLogo: true,
    anchoLogo: 70,
    altoLogo: 70,
    mostrarCentroEducativo: true,
    mostrarTitulo: true,
    mostrarDatosEstudiante: true,
    espacioEntreCampos: 5,
    bordeInferior: false,
    paddingInferior: 10,
  },

  preguntas: {
    alineacion: "justify",
    tamanoFuente: 11,
    interlineado: 1.5,
    sangriaEnunciado: 0,
    espacioAntes: 0,
    espacioDespues: 0,
    mostrarNumero: true,
    numeroEnNegrita: true,
    mostrarPuntuacion: true,
    espacioDespuesPregunta: 18,
  },

  opciones: {
    alineacion: "left",
    tamanoFuente: 11,
    interlineado: 1.3,
    sangriaIzquierda: 20,
    espacioEntreOpciones: 5,
    espacioAntes: 4,
    espacioDespues: 0,
    estiloEtiqueta: "letras",
    etiquetaEnNegrita: false,
  },

  imagenPregunta: {
    posicion: "right",
    anchoMaximo: 180,
    altoMaximo: 160,
    anchoColumnaTexto: 65,
    separacionColumnas: 12,
    margenSuperior: 0,
    margenInferior: 0,
    margenIzquierdo: 0,
    margenDerecho: 0,
    padding: 4,
    ajuste: "contain",
    borde: false,
    radioBorde: 0,
  },

  tipografia: {
    familia: "Arial",
    colorTexto: "#111111",
    colorTitulos: "#000000",
  },
};

export interface ConfiguracionPdfExamen {
  examen_id: Types.ObjectId;
  usuario_id: Types.ObjectId;
  configuracion: ConfiguracionPDF;
}
