import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

const router = Router();

// Configuración de Swagger
export const info = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación de API - Ecommerce",
      version: "1.0.0",
      description:
        "API para la gestión de productos y carritos en el ecommerce",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  // Aquí incluimos los archivos YAML que contienen la documentación de la API
  apis: ["./src/docs/*.yml"],
};

const swaggerDocs = swaggerJsDoc(info);

// Configura el router para servir la documentación
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;
