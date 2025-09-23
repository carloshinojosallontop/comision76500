import Cart from "../models/cart.model.js";
import HttpError from "../utils/HttpError.js";

export async function renderCart(req, res, next) {
  try {
    const { cid } = req.params;
    const cartDoc = await Cart.findById(cid).populate("products.product");
    if (!cartDoc) throw new HttpError(404, "Cart not found");

    const products = cartDoc.products.map((p) => {
      const unitPrice = p?.product?.price ?? 0;
      const lineTotal = unitPrice * p.quantity;
      return {
        ...p.toObject(),
        unitPrice,
        lineTotal,
      };
    });
    const cartTotal = products.reduce((acc, p) => acc + p.lineTotal, 0);

    const cart = { ...cartDoc.toObject(), products };

    return res.render("carts/detail", {
      title: "Mi carrito",
      cart,
      cartId: cartDoc._id, 
      includeCartJS: true, 
      cartTotal,
    });
  } catch (e) {
    next(e);
  }
}
