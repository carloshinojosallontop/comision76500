import { Router } from 'express';
import products from '../controllers/products.controller.js';

const router = Router();

router.get("/", products.getAll);
router.post("/", products.addProduct);
router.get("/:pid", products.getById);
router.put("/:pid", products.updateById);
router.delete("/:pid", products.deleteById);

export default router;