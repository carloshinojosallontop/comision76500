import { Router } from 'express';
import {
  getAll,        // GET /api/products?limit=&page=&sort=&query=
  addProduct,    // POST /api/products
  getById,       // GET /api/products/:pid
  updateById,    // PUT /api/products/:pid
  deleteById,    // DELETE /api/products/:pid
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAll);
router.post("/", addProduct);
router.get("/:pid", getById);
router.put("/:pid", updateById);
router.delete("/:pid", deleteById);

export default router;