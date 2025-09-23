import Product from "../models/product.model.js";

export async function renderHome(req, res, next) {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(12).lean();
    const categoriesRaw = await Product.distinct("category");
    const categories = categoriesRaw
      .filter(Boolean)
      .map(String)
      .filter((s) => s.trim() !== "")
      .sort((a, b) => a.localeCompare(b));

    res.render("products/home", {
      title: "Home",
      isHome: true,
      products,
      categories,
    });
  } catch (e) {
    next(e);
  }
}

export async function renderRealtime(req, res, next) {
  try {
    const products = await Product.find().lean(); // render inicial
    res.render("products/realTimeProducts", {
      title: "Productos en tiempo real",
      isRealtime: true,
      products,
    });
  } catch (e) {
    next(e);
  }
}
