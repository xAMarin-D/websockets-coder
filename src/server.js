import { initMongoDB } from "./daos/mongodb/connection.js";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import fs from "fs/promises";
import path from "path";
import { __dirname } from "./utils.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import { engine } from "express-handlebars";
import handlebars from "handlebars";
import handlebarsLayouts from "handlebars-layouts";
import "dotenv/config";
import { MessageModel } from "./daos/mongodb/models/chat.model.js";

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

handlebars.registerHelper(handlebarsLayouts(handlebars));

app.engine("handlebars", engine({ handlebars }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);
app.use("/carts", cartRouter);

app.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "products.json"),
      "utf8"
    );
    const products = JSON.parse(data);
    res.render("websocket", { products });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    res.status(500).send("Error al cargar la página");
  }
});

app.get("/products-view", async (req, res) => {
  res.render("products");
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "products.json"),
      "utf8"
    );
    const products = JSON.parse(data);
    res.render("realtimeproducts", { products });
  } catch (error) {
    console.error("Error al cargar los productos en tiempo real:", error);
    res.status(500).send("Error al cargar la página");
  }
});

app.get("/chat", async (req, res) => {
  res.render("chat");
});

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("newMessage", async (data) => {
    const { email, message } = data;
    try {
      const chatMessage = new MessageModel({ email, message });
      await chatMessage.save();
      io.emit("message", data);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.use(errorHandler);

if (process.env.PERSISTENCE === "MONGO") {
  initMongoDB();
}

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server ok en port ${PORT}`);
});
