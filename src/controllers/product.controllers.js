import ProductService from "../services/product.services.js";
import mongoose from "mongoose";

const productService = new ProductService();

export const getAll = async (req, res, next) => {
  try {
    const {
      query,
      limit = 10,
      page = 1,
      sort,
      category,
      availability,
    } = req.query;

    let filter = {};
    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (availability !== undefined) {
      filter.stock = { $gt: availability > 0 ? 0 : -1 };
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort:
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
    };

    const response = await productService.getAll(filter, options);

    const result = {
      status: "success",
      payload: response.docs,
      totalDocs: response.totalDocs,
      limit: response.limit,
      totalPages: response.totalPages,
      page: response.page,
      pagingCounter: response.pagingCounter,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevPage: response.prevPage,
      nextPage: response.nextPage,
      prevLink: response.hasPrevPage
        ? `/products?limit=${limit}&page=${response.prevPage}&sort=${sort}`
        : null,
      nextLink: response.hasNextPage
        ? `/products?limit=${limit}&page=${response.nextPage}&sort=${sort}`
        : null,
    };

    res.json(result);
  } catch (error) {
    console.error("Error getting products:", error);
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const product = await productService.getById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    return product;
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const newProd = await productService.create(req.body);
    if (!newProd) res.status(404).json({ msg: "Error creating product" });
    else res.json(newProd);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const prodUpd = await productService.update(id, req.body);
    if (!prodUpd) res.status(404).json({ msg: "Error updating product" });
    else res.json(prodUpd);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const prodDel = await productService.delete(id);
    if (!prodDel) res.status(404).json({ msg: "Error removing product" });
    else res.json(prodDel);
  } catch (error) {
    next(error);
  }
};
