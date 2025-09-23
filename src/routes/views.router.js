// import { Router } from 'express';
// import ProductManager from '../managers/ProductManager.js';

// const router = Router();
// const productManager = new ProductManager('src/data/products.json');

// router.get('/', async (req, res) => {
//   const products = await productManager.getAll();
//   res.render('home', { title: 'Home', isHome: true, products });
// });

// router.get('/realtimeproducts', async (req, res) => {
//   const products = await productManager.getAll();
//   res.render('realTimeProducts', { title: 'Productos en tiempo real', isRealtime: true, products });
// });

// export default router;

import { Router } from "express";
import { renderHome, renderRealtime } from "../controllers/products.view.controller.js";

const router = Router();
router.get("/", renderHome);
router.get("/realtimeproducts", renderRealtime);
export default router;