// src/sockets/index.js
import Product from "../models/product.model.js";

export default function registerSockets(io) {
  io.on("connection", async (socket) => {
    // Estado inicial
    try {
      const products = await Product.find().lean();
      socket.emit("products", products);
    } catch (e) {
      console.error("WS init products error:", e);
    }

    socket.on("need-products", async () => {
      try {
        const products = await Product.find().lean();
        socket.emit("products", products);
      } catch (e) {
        console.error("WS need-products error:", e);
      }
    });

    socket.on("new-product", async (payload, ack) => {
      try {
        // Normalizamos code a string sin espacios
        if (!payload?.code) {
          ack?.({ ok: false, msg: "code is required" });
          return;
        }
        payload.code = String(payload.code).trim();

        await Product.create(payload);
        const updated = await Product.find().lean();
        io.emit("products", updated);
        ack?.({ ok: true });
      } catch (e) {
        console.error("WS new-product error:", e);
        ack?.({ ok: false, msg: e?.message || "No se pudo crear el producto" });
      }
    });

    socket.on("delete-product", async ({ code }, ack) => {
      try {
        if (!code) {
          ack?.({ ok: false, msg: "code is required" });
          return;
        }
        const normalized = String(code).trim();

        const deleted = await Product.findOneAndDelete({ code: normalized });

        if (!deleted) {
          ack?.({ ok: false, msg: "Product not found for code" });
          return;
        }

        const updated = await Product.find().lean();
        io.emit("products", updated);
        ack?.({ ok: true });
      } catch (e) {
        console.error("WS delete-product error:", e);
        ack?.({
          ok: false,
          msg: e?.message || "No se pudo eliminar el producto",
        });
      }
    });
  });
}
