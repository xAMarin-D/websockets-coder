import CartService from "../services/cart.service.js";
import mongoose from "mongoose";
import { TicketModel } from "../daos/mongodb/models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

const cartService = new CartService();

export const getAll = async (req, res, next) => {
  try {
    const response = await cartService.getAll();
    res.json(response);
  } catch (error) {
    console.error("Error getting carts:", error);
    next(error.message);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const cart = await cartService.getById(id);
    if (!cart) res.status(404).json({ msg: "Cart not found" });
    else res.json(cart);
  } catch (error) {
    console.error("Error getting cart by ID:", error);
    next(error.message);
  }
};

export const create = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    const newCart = await cartService.create(req.body);
    if (!newCart) {
      res.status(404).json({ msg: "Error creating cart" });
    } else {
      res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ msg: error.message || "Internal Server Error" });
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const cartUpd = await cartService.update(id, req.body);
    if (!cartUpd) res.status(404).json({ msg: "Error updating cart" });
    else res.json(cartUpd);
  } catch (error) {
    next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const cartDel = await cartService.delete(id);
    if (!cartDel) res.status(404).json({ msg: "Error removing cart" });
    else res.json(cartDel);
  } catch (error) {
    next(error.message);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user.cartId) {
      return res.status(400).json({ msg: "Cart ID not found in session" });
    }

    const { id } = req.params;
    const quantity = req.body.quantity || 1;
    const cartId = req.session.user.cartId;

    console.log("Cart ID:", cartId);

    const updatedCart = await cartService.addProductToCart(
      cartId,
      id,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    next(error);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const { id, pid } = req.params;
    const updatedCart = await cartService.deleteProduct(id, pid);
    res.json(updatedCart);
  } catch (error) {
    next(error.message);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCart = await cartService.updateCart(id, req.body);
    res.json(updatedCart);
  } catch (error) {
    next(error.message);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { id, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartService.updateProductQuantity(
      id,
      pid,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    next(error.message);
  }
};

export const deleteAllProductsFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCart = await cartService.deleteAllProducts(id);
    res.json(updatedCart);
  } catch (error) {
    next(error.message);
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const { id: cartId } = req.params;
    const cart = await cartService.getById(cartId);

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    let totalAmount = 0;
    let productsUnavailable = [];

    for (let product of cart.products) {
      const productData = await productService.getById(product.productId);
      if (productData.stock >= product.quantity) {
        totalAmount += productData.price * product.quantity;
        productData.stock -= product.quantity;
        await productService.update(product.productId, {
          stock: productData.stock,
        });
      } else {
        productsUnavailable.push(product.productId);
      }
    }

    if (productsUnavailable.length > 0) {
      res.json({ msg: "Some products are unavailable", productsUnavailable });
    } else {
      const ticket = new TicketModel({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: req.user.email,
      });
      await ticket.save();
      res.json({ msg: "Purchase successful", ticket });
    }
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getById(req.session.user?.cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.render("cart", { cart });
  } catch (error) {
    next(error);
  }
};
