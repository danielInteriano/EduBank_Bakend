import "dotenv/config";
import app from "./src/app.js";
import { dbConnection } from "./src/config/database.js";

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  await dbConnection();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

startServer().catch((error: Error) => {
  console.error("Error al iniciar el servidor:", error);
});
