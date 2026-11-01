import express from "express";
import cors, { type CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import os from "os";
import path from "path";
import { authRouter } from "./routes/auth.routes.js";
import { archivosRouter } from "./routes/archivos.routes.js";
import { asignaturasRouter } from "./routes/asignaturas.routes.js";
import { bloquesRouter } from "./routes/bloques.routes.js";
import { configuracionRouter } from "./routes/configuracion-pdf.routes.js";
import { encabezadosRouter } from "./routes/encabezados.routes.js";
import { examenesRouter } from "./routes/examenes.routes.js";
import { gradosRouter } from "./routes/grados.routes.js";
import { preguntasRouter } from "./routes/preguntas.routes.js";
import { temasRouter } from "./routes/temas.routes.js";
import { usuariosRouter } from "./routes/usuarios.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

/*Configuración de CORS*/
const corsOptions: CorsOptions = {
  origin: "localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
app.use("/uploads", express.static(path.resolve("uploads")));

/*Lectura y parseo del body de las solicitudes*/
app.use(express.urlencoded({ extended: true }));

/*Rutas de la aplicación*/
app.use("/api/auth", authRouter);
app.use("/api/archivos", archivosRouter);
app.use("/api/asignaturas", asignaturasRouter);
app.use("/api/bloques", bloquesRouter);
app.use("/api/examenes", configuracionRouter);
app.use("/api/encabezado", encabezadosRouter);
app.use("/api/examenes", examenesRouter);
app.use("/api/grados", gradosRouter);
app.use("/api/preguntas", preguntasRouter);
app.use("/api/temas", temasRouter);
app.use("/api/usuarios", usuariosRouter);

export default app;
