import { Router } from "express";
import carts from "../controllers/carts.controller.js";

const router = Router();

router.post("/", carts.create);
router.get("/", carts.getAll);
router.post("/:cid/product/:pid", carts.addToCart);
router.get("/:cid", carts.getById);
router.put("/:cid", carts.replaceProducts);
router.put("/:cid/products/:pid", carts.updateQuantity);
router.delete("/:cid/products/:pid", carts.removeProduct);
router.delete("/:cid", carts.clearCart);

export default router;
