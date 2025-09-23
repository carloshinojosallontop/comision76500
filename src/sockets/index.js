import Product from "../models/product.model.js";

export default function registerSockets(io) {
  io.on("connection", async (socket) => {
    console.log("client connected:", socket.id);

    // Enviar estado inicial (todos los productos)
    try {
      const products = await Product.find().lean();
      socket.emit("products", products);
    } catch (e) {
      console.error("WS: error sending initial products", e);
    }

    // Cliente pide refrescar productos
    socket.on("need-products", async () => {
      try {
        const products = await Product.find().lean();
        socket.emit("products", products);
      } catch (e) {
        console.error("WS: error on need-products", e);
      }
    });

    // Crear producto desde WS
    socket.on("new-product", async (payload) => {
      try {
        // payload debería tener: { title, code, price, stock, category, ... }
        await Product.create(payload);
        const updated = await Product.find().lean();
        io.emit("products", updated); // broadcast a todos
      } catch (e) {
        console.error("WS: error creating product", e);
        // Opcional: avisar solo a ese cliente del error
        socket.emit("error:product", { message: "No se pudo crear el producto" });
      }
    });

    // Borrar producto desde WS
    socket.on("delete-product", async ({ id }) => {
      try {
        await Product.findByIdAndDelete(id);
        const updated = await Product.find().lean();
        io.emit("products", updated); // broadcast
      } catch (e) {
        console.error("WS: error deleting product", e);
        socket.emit("error:product", { message: "No se pudo eliminar el producto" });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 client disconnected:", socket.id);
    });
  });
}
