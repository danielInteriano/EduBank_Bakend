import express from "express";
import cors, { type CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import os from "os";
import path from "path";
import { authRouter } from "./routes/auth.routes.js";
import { asignaturasRouter } from "./routes/asignaturas.routes.js";
import { preguntasRouter } from "./routes/preguntas.routes.js";
import { bloquesRouter } from "./routes/bloques.routes.js";
import { temasRouter } from "./routes/temas.routes.js";
import { usuariosRouter } from "./routes/usuarios.routes.js";
import { encabezadosRouter } from "./routes/encabezados.routes.js";
import archivosRoutes from "./routes/archivos.js";
import pdfExamenesRoutes from "./routes/pdf-examenes.js";
import preguntasPorEvaluacionRoutes from "./routes/preguntas-por-evaluacion.js";
import reportesRoutes from "./routes/reportes.js";
import respuestasRoutes from "./routes/respuestas.js";
import examenesRouter from "./routes/evaluaciones.js";

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
app.use("/api/auth", authRouter);
app.use("/api/asignaturas", asignaturasRouter);
app.use("/api/preguntas", preguntasRouter);
app.use("/api/bloques", bloquesRouter);
app.use("/api/temas", temasRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/encabezado", encabezadosRouter);
app.use("/api/examenes", examenesRouter);

//pendientes de desarrollo
app.use("/api/archivos", archivosRoutes);
app.use("/api/evaluaciones/:id/preguntas", preguntasPorEvaluacionRoutes);
app.use("/api/pdf-examenes", pdfExamenesRoutes);
app.use("/api/respuestas", respuestasRoutes);
app.use("/api/reportes", reportesRoutes);

export default app;
