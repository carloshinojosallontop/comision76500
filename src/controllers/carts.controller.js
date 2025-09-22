import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import HttpError from "../utils/HttpError.js";
import mongoose from "mongoose";

/**
 * POST /api/carts
 * Crea un carrito vacío (o podrías extender para aceptar products iniciales)
 */
export async function create(req, res, next) {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json(cart);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/carts
 * Lista todos los carritos (útil en desarrollo)
 */
export async function getAll(req, res, next) {
  try {
    const carts = await Cart.find().populate("products.product");
    res.json(carts);
  } catch (e) {
    next(e);
  }
}
/**
 * POST /api/carts/:cid/product/:pid
 * Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
 * Body opcional: { quantity: <Number> } => default 1
 */
export async function addToCart(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const qty =
      Number.isInteger(req.body?.quantity) && req.body.quantity > 0
        ? req.body.quantity
        : 1;

    if (!mongoose.isValidObjectId(cid))
      throw new HttpError(400, "Invalid cart id");
    if (!mongoose.isValidObjectId(pid))
      throw new HttpError(400, "Invalid product id");

    const cart = await Cart.findById(cid);
    if (!cart) throw new HttpError(404, "Cart not found");

    const prodExists = await Product.exists({ _id: pid });
    if (!prodExists) throw new HttpError(404, "Product not found");

    const item = cart.products.find((p) => String(p.product) === String(pid));
    if (item) item.quantity += qty;
    else cart.products.push({ product: pid, quantity: qty });

    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/carts/:cid
 * Obtiene un carrito por id con populate
 */

export async function getById(req, res, next) {
  try {
    const { cid } = req.params;
    if (!mongoose.isValidObjectId(cid))
      throw new HttpError(400, "Invalid cart id");

    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) throw new HttpError(404, "Cart not found");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/**
 * PUT /api/carts/:cid
 * Reemplaza TODO el arreglo products
 * Body: { products: [{ product, quantity }] }
 */
export async function replaceProducts(req, res, next) {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!mongoose.isValidObjectId(cid))
      throw new HttpError(400, "Invalid cart id");
    if (!Array.isArray(products)) {
      throw new HttpError(
        400,
        "products must be an array of {product, quantity}"
      );
    }

    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products },
      { new: true, runValidators: true }
    ).populate("products.product");

    if (!cart) throw new HttpError(404, "Cart not found");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/**
 * PUT /api/carts/:cid/products/:pid
 * Actualiza SOLO la cantidad de un producto del carrito
 * Body: { quantity: <Number> }
 */
export async function updateQuantity(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!mongoose.isValidObjectId(cid))
      throw new HttpError(400, "Invalid cart id");
    if (!mongoose.isValidObjectId(pid))
      throw new HttpError(400, "Invalid product id");
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new HttpError(400, "Invalid quantity");
    }

    const cart = await Cart.findById(cid);
    if (!cart) throw new HttpError(404, "Cart not found");

    const item = cart.products.find((p) => String(p.product) === String(pid));
    if (!item) throw new HttpError(404, "Product not in cart");

    item.quantity = quantity;
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/**
 * DELETE /api/carts/:cid/products/:pid
 * Elimina un producto del carrito
 */
export async function removeProduct(req, res, next) {
  try {
    const { cid, pid } = req.params;

    if (!mongoose.isValidObjectId(cid))
      throw new HttpError(400, "Invalid cart id");
    if (!mongoose.isValidObjectId(pid))
      throw new HttpError(400, "Invalid product id");

    const cart = await Cart.findById(cid);
    if (!cart) throw new HttpError(404, "Cart not found");

    cart.products = cart.products.filter(
      (p) => String(p.product) !== String(pid)
    );
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/**
 * DELETE /api/carts/:cid
 * Vacía el carrito
 */
export async function clearCart(req, res, next) {
  try {
    const { cid } = req.params;
    if (!mongoose.isValidObjectId(cid))
      throw new HttpError(400, "Invalid cart id");

    const cart = await Cart.findById(cid);
    if (!cart) throw new HttpError(404, "Cart not found");

    cart.products = [];
    await cart.save();
    res.json(cart);
  } catch (e) {
    next(e);
  }
}
