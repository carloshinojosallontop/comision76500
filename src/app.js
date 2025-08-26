import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { engine as handlebarsEngine } from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const PORT = Number(process.env.PORT) || 8080;
const app = express();

// ----- Middlewares -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/src/public"));

// ----- Handlebars -----
app.engine("handlebars", handlebarsEngine({
  layoutsDir: process.cwd() + "/src/views/layouts",
  defaultLayout: "main",
  partialsDir: process.cwd() + "/src/views/partials",
}));
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "handlebars");

// ----- Routers (API) -----
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// ----- Views Router -----
app.use("/", viewsRouter);

// ----- HTTP + Socket.IO -----
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// Hace io accesible desde las rutas (para HTTP -> Puente WS)
app.set("io", io);

// Eventos WS
const productManager = new ProductManager("src/data/products.json");

io.on("connection", async (socket) => {
  // Send initial state
  socket.emit("products", await productManager.getAll());

  socket.on("need-products", async () => {
    socket.emit("products", await productManager.getAll());
  });

  socket.on("new-product", async (payload) => {
    try {
      const created = await productManager.addProduct(payload);
      const updated = await productManager.getAll();
      io.emit("products", updated);
    } catch (e) {
      console.error("Error creating product via WS", e);
    }
  });

  socket.on("delete-product", async ({ id }) => {
    try {
      await productManager.deleteProduct(id);
      const updated = await productManager.getAll();
      io.emit("products", updated);
    } catch (e) {
      console.error("Error deleting product via WS", e);
    }
  });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
