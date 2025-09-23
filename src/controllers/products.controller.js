import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { buildPageLinks } from "../utils/buildLinks.js";
import HttpError from "../utils/HttpError.js";

const getAll = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtros simples: query="status:true" | "category:Notebooks"
    const filter = {};
    if (query) {
      const [k, v] = String(query).split(":");
      if (k === "status") filter.status = v === "true";
      if (k === "category") filter[k] = v;
    }

    // Orden por precio
    const sortOpt = {};
    if (sort === "asc") sortOpt.price = 1;
    if (sort === "desc") sortOpt.price = -1;

    const result = await Product.paginate(filter, {
      limit: Number(limit),
      page: Number(page),
      sort: sortOpt,
    });

    const links = buildPageLinks(
      req,
      result.page,
      result.hasPrevPage,
      result.prevPage,
      result.hasNextPage,
      result.nextPage
    );

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      ...links,
    });
  } catch (e) {
    next(e);
  }
}

const addProduct = async (req, res, next) => {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
}

const getById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    if (!mongoose.isValidObjectId(pid)) {
      throw new HttpError(400, "Invalid product id");
    }
    const product = await Product.findById(pid);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
}

const updateById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    if (!mongoose.isValidObjectId(pid)) {
      throw new HttpError(400, "Invalid product id");
    }
    const updated = await Product.findByIdAndUpdate(pid, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new HttpError(404, "Product not found");
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

const deleteById = async (req, res, next) => {
  try {
    const { pid } = req.params;
      if (!mongoose.isValidObjectId(pid)) {
      throw new HttpError(400, "Invalid product id");
    }
    const deleted = await Product.findByIdAndDelete(pid);
    if (!deleted) throw new HttpError(404, "Product not found");
    res.json({ message: "Product deleted" });
  } catch (e) {
    next(e);
  }
}
 export default {
  getAll,
  addProduct,
  getById,
  updateById,
  deleteById,
};