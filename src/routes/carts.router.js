import express from "express";
import CartManager from "../managers/CartManager.js";
import path from "path";

const router = express.Router();
const cartManager = new CartManager("src/data/carts.json");

// POST /
router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /:cid
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Cart not found" });
  res.json(cart.products);
});

// POST /:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  const updatedCart = await cartManager.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  if (!updatedCart) return res.status(404).json({ error: "Cart not found" });
  res.json(updatedCart);
});

export default router;
