import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import errorHandler from "./middlewares/error.middleware.js";
import handlebarsEngine from "./config/handlebars.config.js";

const app = express();

// ----- Middlewares -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/src/public"));

// // ----- Handlebars -----
app.engine("handlebars", handlebarsEngine);
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "handlebars");

// ----- Routers (API) -----
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// ----- Views Router -----
app.use("/", viewsRouter);

// ----- Error Handling Middleware -----
app.use(errorHandler);

export default app;
