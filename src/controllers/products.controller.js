import Product from "../../models/product.model.js";
import { buildPageLinks } from "../../utils/buildLinks.js";

export async function list(req, res, next) {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = {};
    if (query) {
      const [k, v] = String(query).split(":");
      if (k === "status") filter.status = v === "true";
      if (k === "category") filter[k] = v;
    }
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

export async function create(req, res, next) {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
}
