import { CartModel } from "./models/cart.model.js";
import mongoose from "mongoose";

export default class CartDaoMongoDB {
  async getAll() {
    try {
      const response = await CartModel.find({});
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ObjectId");
      }
      const response = await CartModel.findById(id).populate(
        "products.productId"
      );
      if (!response) {
        throw new Error("Cart not found");
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(obj) {
    try {
      const response = await CartModel.create(obj);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, obj) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ObjectId");
      }
      const response = await CartModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
      if (!response) {
        throw new Error("Cart not found");
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ObjectId");
      }
      const response = await CartModel.findByIdAndDelete(id);
      if (!response) {
        throw new Error("Cart not found");
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(cartId) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        throw new Error("Invalid ObjectId");
      }
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const existingProductIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error(error);
    }
  }
}
