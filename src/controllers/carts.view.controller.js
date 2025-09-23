import Cart from "../models/cart.model.js";
import HttpError from "../utils/HttpError.js";

function toNumberSafe(v, { defaultValue = 0 } = {}) {
  if (v === null || v === undefined) return defaultValue;
  if (typeof v === "string") {
    const cleaned = v.replace(/\s+/g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : defaultValue;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}

export async function renderCart(req, res, next) {
  try {
    const { cid } = req.params;
    const cartDoc = await Cart.findById(cid)
      .populate("products.product")
      .lean();

    if (!cartDoc) throw new HttpError(404, "Cart not found");

    const lines = (cartDoc.products || []).map((p) => {
      const unitPrice = toNumberSafe(p?.product?.price, { defaultValue: 0 });
      const quantity = toNumberSafe(p?.quantity, { defaultValue: 1 });
      const lineTotal = unitPrice * quantity;
      return {
        title: p?.product?.title ?? "",
        unitPrice,
        quantity,
        lineTotal,
      };
    });

    const cartTotal = lines.reduce((acc, l) => acc + l.lineTotal, 0);

    res.render("carts/detail", {
      title: "Mi carrito",
      isCart: true,
      cartId: cartDoc._id,
      lines,
      cartTotal,
    });
  } catch (e) {
    next(e);
  }
}
