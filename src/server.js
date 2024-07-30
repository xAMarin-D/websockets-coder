import "dotenv/config";
import { initMongoDB } from "./db/connection.js";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { __dirname } from "./utils.js";
import morgan from "morgan";
import { engine } from "express-handlebars";
import handlebars from "handlebars";
import handlebarsLayouts from "handlebars-layouts";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "./passport/github.js";
import "./passport/local.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import userRouter from "./routes/user.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import ProductService from "./services/product.services.js";
import { MessageModel } from "./daos/mongodb/models/chat.model.js";

// INIT CONF
const app = express();
const httpServer = createServer(app);

// CONF SESION & MONGO
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 180,
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 180000,
      httpOnly: true,
      secure: false, // Cambiar a true si se usa HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const productService = new ProductService();

// CONF HANDLEBARS
handlebars.registerHelper(handlebarsLayouts(handlebars));
app.engine(
  "handlebars",
  engine({
    handlebars,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// MDWARES
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("Session User:", req.session.user);
  console.log("Session Passport:", req.session.passport);
  next();
});
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// RUTAS
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/users", userRouter);
app.use("/views", viewsRouter);
app.use("/api/sessions", sessionRouter);

// VISTAS
app.get("/", (req, res) => {
  console.log("Session User at /:", req.session.user);
  res.redirect("/views/login");
});

app.get("/views/products", (req, res) => {
  console.log("Session User at /views/products:", req.session.user);
  res.render("products");
});

app.get("/views/cart", (req, res) => {
  console.log("Session User at /views/cart:", req.session.user);
  res.render("cart");
});

app.get("/views/login", (req, res) => {
  console.log("Session User at /views/login:", req.session.user);
  res.render("login");
});

app.get("/views/register", (req, res) => {
  console.log("Session User at /views/register:", req.session.user);
  res.render("register");
});

app.get("/views/profile", (req, res) => {
  console.log("Session User at /views/profile:", req.session.user);
  console.log("Session Passport User at /views/profile:", req.user);
  res.render("profile", { user: req.session.user || req.user });
});

app.get("/product/:id", async (req, res, next) => {
  console.log("Session User at /product/:id:", req.session.user);
  console.log("Session Passport User at /product/:id:", req.user);
  try {
    const { id } = req.params;
    const product = await productService.getById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("product", { product });
  } catch (error) {
    next(error);
  }
});

const io = new SocketIOServer(httpServer);
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

// MONGO CONF
if (process.env.PERSISTENCE === "MONGO") {
  initMongoDB();
}

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server ok en port ${PORT}`);
});
