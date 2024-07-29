import ProductService from "../services/product.services.js";
import CartService from "../services/cart.service.js";
import mongoose from "mongoose";

const productService = new ProductService();
const cartService = new CartService();

export const renderLogin = (req, res) => {
  res.render("login");
};

export const renderRegister = (req, res) => {
  res.render("register");
};

export const renderProducts = async (req, res) => {
  const { query, limit = 10, page = 1, sort } = req.query;
  const filter = query ? { title: { $regex: query, $options: "i" } } : {};
  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort } : {},
  };
  const response = await productService.getAll(filter, options);
  res.render("products", { products: response.docs });
};

export const renderProductDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid ObjectId" });
  }
  const product = await productService.getById(id);
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }
  res.render("product", { product });
};

export const renderCart = async (req, res) => {
  const cartId = req.session.cartId;
  if (!cartId) {
    return res.render("cart", { products: [] });
  }
  const cart = await cartService.getById(cartId);
  res.render("cart", { products: cart.products });
};
