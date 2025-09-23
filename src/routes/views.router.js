import { Router } from "express";
import { renderHome, renderRealtime } from "../controllers/products.view.controller.js";
import { renderCart } from "../controllers/carts.view.controller.js";

const router = Router();

router.get("/", renderHome);
router.get("/realtimeproducts", renderRealtime);
router.get("/carts/:cid", renderCart);

export default router;