import "dotenv/config";
import { initMongoDB } from "./db/connection.js";
import express from "express";
import { createServer } from "http";
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
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import userRouter from "./routes/user.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import ticketRouter from "./routes/ticket.router.js";
import ProductService from "./services/product.services.js";
import emailRouter from "./routes/email.router.js";
import mockingRouter from "./routes/mocking.router.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { info } from "./docs/info.js";

//INIT CONF
const app = express();
const httpServer = createServer(app);
const swaggerDocs = swaggerJsdoc(info);

//CONF SESION & MONGO
const storeConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 180,
  }),
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 180000 },
};

const productService = new ProductService();

//CONF HANDLEBARS
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

//MDWARES
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(storeConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//Ruta exclusiva
app.use("/api/users", userRouter);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  "/api",
  (req, res, next) => {
    console.log(`API route accessed: ${req.originalUrl}`);
    next();
  },
  emailRouter
);

//RUTAS

app.use("/api", emailRouter, mockingRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/users", userRouter);
app.use("/views", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/ticket", ticketRouter);
app.use("/api/users", userRouter);

//VISTAS
app.get("/", (req, res) => {
  res.redirect("/views/login");
});

app.get("/products-view", async (req, res) => {
  res.render("products");
});

app.get("/chat", async (req, res) => {
  res.render("chat");
});

app.get("/product/:id", async (req, res, next) => {
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

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user,
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/loggerTest", (req, res) => {
  logger.debug("Este es un mensaje de depuración");
  logger.http("Este es un mensaje http");
  logger.info("Este es un mensaje informativo");
  logger.warning("Este es un mensaje de advertencia");
  logger.error("Este es un mensaje de error");
  logger.fatal("Este es un mensaje fatal");
  res.send("¡Los logs han sido enviados!");
});

app.use(errorHandler);

//MONGO CONF
if (process.env.PERSISTENCE === "MONGO") {
  initMongoDB()
    .then(() => {
      const PORT = 8080;
      httpServer.listen(PORT, () => {
        console.log(`Server ok en port ${PORT}`);
        logger.info(`Server ok en port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Error al iniciar el servidor:", error);
    });
}

export default app;
