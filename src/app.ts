import express from "express";
import cors, { type CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import os from "os";
import path from "path";
import authRoutes from "./routes/auth.js";
import archivosRoutes from "./routes/archivos.js";
import asignaturasRoutes from "./routes/asignaturas.js";
import bloquesRoutes from "./routes/bloques.js";
import categoriasRoutes from "./routes/categorias.js";
import encabezadoRoutes from "./routes/encabezados.js";
import evaluacionesRoutes from "./routes/evaluaciones.js";
import loginRoutes from "./routes/login.js";
import usuariosRoutes from "./routes/usuarios.js";
import pdfExamenesRoutes from "./routes/pdf-examenes.js";
import preguntasRoutes from "./routes/preguntas.js";
import preguntasPorEvaluacionRoutes from "./routes/preguntas-por-evaluacion.js";
import preguntasPorTemaRoutes from "./routes/preguntas-por-tema.js";
import reportesRoutes from "./routes/reportes.js";
import respuestasRoutes from "./routes/respuestas.js";
import temasRoutes from "./routes/temas.js";
import temasPorBloqueRoutes from "./routes/temas-por-bloque.js";

const app = express();

app.use(cors());
app.use(express.json());

/*Configuración de CORS*/
const corsOptions: CorsOptions = {
  origin: "localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "access-token"],
  credentials: true,
  exposedHeaders: ["access-token"],
};

app.use(cors(corsOptions));

/*Configuración para subir archivos*/
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
);

/*Carpeta pública para servir archivos estáticos*/
app.use(express.static(path.resolve("public")));

/*Lectura y parseo del body de las solicitudes*/
app.use(express.urlencoded({ extended: true }));

/*Rutas de la aplicación*/
app.use("/api/auth", authRoutes);
app.use("/api/archivos", archivosRoutes);
app.use("/api/asignaturas", asignaturasRoutes);
app.use("/api/bloques", bloquesRoutes);
app.use("/api/bloques/:id/temas", temasPorBloqueRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/encabezado", encabezadoRoutes);
app.use("/api/evaluaciones", evaluacionesRoutes);
app.use("/api/evaluaciones/:id/preguntas", preguntasPorEvaluacionRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use("/api/pdf-examenes", pdfExamenesRoutes);
app.use("/api/preguntas/:id/temas", preguntasPorTemaRoutes);
app.use("/api/respuestas", respuestasRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/temas", temasRoutes);
app.use("/api/usuarios", usuariosRoutes);

export default app;
