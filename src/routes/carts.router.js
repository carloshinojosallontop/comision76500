import express from "express";
import CartManager from "../managers/CartManager.js";

const router = express.Router();
const cartManager = new CartManager("src/data/carts.json");

// POST /
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

// GET /:cid
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

// POST /:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    if (!updatedCart) return res.status(404).json({ error: "Cart not found" });
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

export default router;
