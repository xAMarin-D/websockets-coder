import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;

export const initMongoDB = async () => {
  try {
    //console.log("Intentando conectar a MongoDB en URL:", MONGO_URL);
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a la base de datos de MONGODB exitosamente");
  } catch (error) {
    console.error("Error al conectar a la base de datos de MONGODB:", error);
  }
};
