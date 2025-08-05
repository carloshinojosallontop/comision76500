import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = express.Router(); // Instancia del ProductManager
const productManager = new ProductManager('src/data/products.json');

// GET /
router.get('/', async (req, res) => {
  const products = await productManager.getAll();
  res.json(products);
});

// GET /:pid
router.get('/:pid', async (req, res) => {
  const product = await productManager.getById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || status === undefined || !stock || !category)
    return res.status(400).json({ error: 'Missing fields' });
  const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
  res.status(201).json(newProduct);
});

// PUT /:pid
router.put('/:pid', async (req, res) => {
  const updateFields = req.body;
  delete updateFields.id; // No se debe modificar el id
  const updatedProduct = await productManager.updateProduct(req.params.pid, updateFields);
  if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
  res.json(updatedProduct);
});

// DELETE /:pid
router.delete('/:pid', async (req, res) => {
  const deleted = await productManager.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.status(204).send();
});

export default router;
