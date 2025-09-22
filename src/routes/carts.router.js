import { Router } from "express";
import {
  create,
  getAll,
  addToCart,
  getById,
  replaceProducts,
  updateQuantity,
  removeProduct,
  clearCart,
} from "../controllers/carts.controller.js";

const router = Router();

router.post("/", create);
router.get("/", getAll);
router.post("/:cid/product/:pid", addToCart);
router.get("/:cid", getById);
router.put("/:cid", replaceProducts);
router.put("/:cid/products/:pid", updateQuantity);
router.delete("/:cid/products/:pid", removeProduct);
router.delete("/:cid", clearCart);

export default router;
