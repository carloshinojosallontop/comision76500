import Cart from "../../models/cart.model.js";
import HttpError from "../../utils/HttpError.js";

export async function getById(req, res, next) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) throw new HttpError(404, "Cart not found");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

export async function replaceProducts(req, res, next) {
  try {
    const { cid } = req.params;
    const { products } = req.body; // array completo [{product, quantity}]
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

export async function updateQuantity(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new HttpError(400, "Invalid quantity");
    }
    const cart = await Cart.findById(cid);
    if (!cart) throw new HttpError(404, "Cart not found");
    const item = cart.products.find((p) => String(p.product) === pid);
    if (!item) throw new HttpError(404, "Product not in cart");
    item.quantity = quantity;
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

export async function removeProduct(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) throw new HttpError(404, "Cart not found");
    cart.products = cart.products.filter((p) => String(p.product) != pid);
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

export async function clearCart(req, res, next) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) throw new HttpError(404, "Cart not found");
    cart.products = [];
    await cart.save();
    res.json(cart);
  } catch (e) {
    next(e);
  }
}
