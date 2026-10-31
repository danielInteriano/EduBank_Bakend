import multer from "multer";
import { ManejarError } from "../classes/manejo-error.class.js";

const storage = multer.memoryStorage();
export const subirImagen = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const permitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!permitidos.includes(file.mimetype)) {
      return callback(
        new ManejarError("Solo se permiten imágenes JPG, PNG y WEBP", 400),
      );
    }

    callback(null, true);
  },
});
