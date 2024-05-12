import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import fs from "fs/promises";
import path from "path";
import { __dirname } from "./path.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.js";
import { engine } from "express-handlebars";
import handlebars from "handlebars";
import handlebarsLayouts from "handlebars-layouts";

const app = express();

// Crear el servidor HTTP usando la aplicación de Express
const httpServer = createServer(app);

// Configurar Socket.IO con el servidor HTTP
const io = new SocketIOServer(httpServer);

// Registra los helpers de handlebars-layouts
handlebars.registerHelper(handlebarsLayouts(handlebars));

// Configuración de Handlebars con helpers
app.engine("handlebars", engine({ handlebars }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/products", productRouter);
app.use("/api/carts", cartRouter);

// Ruta principal que muestra la página home con productos desde products.json
app.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "products.json"),
      "utf8"
    );
    const products = JSON.parse(data);
    res.render("websocket", { products }); // Cambiado de "home" a "websocket"
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    res.status(500).send("Error al cargar la página");
  }
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "products.json"),
      "utf8"
    );
    const products = JSON.parse(data);
    res.render("realtimeproducts", { products }); // Asegúrate de tener realtimeproducts.handlebars
  } catch (error) {
    console.error("Error al cargar los productos en tiempo real:", error);
    res.status(500).send("Error al cargar la página");
  }
});

// Configuración de eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado con ID: " + socket.id);

  socket.on("update products", async () => {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "data", "products.json"),
        "utf8"
      );
      const products = JSON.parse(data);
      io.emit("products updated", products);
    } catch (error) {
      console.error("Error al actualizar los productos:", error);
      socket.emit("error", "Error al cargar los productos");
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// Manejo de errores
app.use(errorHandler);

// Escuchar en el puerto
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server ok en port ${PORT}`);
});
