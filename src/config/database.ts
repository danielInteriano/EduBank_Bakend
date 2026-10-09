import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {});
    console.log("Conexión--DB online");
  } catch (error) {
    console.log("Error al conectar a la base de datos:", error);
    throw new Error("Error al conectar DB");
  }
};

export { dbConnection };
