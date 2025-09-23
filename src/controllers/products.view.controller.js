import Product from "../models/product.model.js";
import HttpError from "../utils/HttpError.js";

/** GET /  -> Home */
export async function renderHome(req, res, next) {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(12).lean();
    res.render("home", { title: "Home", isHome: true, products });
  } catch (e) {
    next(e);
  }
}

/** GET /realtimeproducts  -> Vista tiempo real */
export async function renderRealtime(req, res, next) {
  try {
    const products = await Product.find().lean(); // render inicial
    res.render("realTimeProducts", {
      title: "Productos en tiempo real",
      isRealtime: true,
      products,
    });
  } catch (e) {
    next(e);
  }
}
