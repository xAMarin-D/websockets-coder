import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import mongoose from "mongoose";

export default class CartService {
  constructor() {
    this.dao = new CartDaoMongoDB();
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.getById(id);
  }

  async create(obj) {
    try {
      return await this.dao.create(obj);
    } catch (error) {
      console.error("Error in CartService.create:", error);
      throw error;
    }
  }

  async update(id, obj) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.update(id, obj);
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.delete(id);
  }

  async addProductToCart(cartId, productId, quantity) {
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.addProductToCart(cartId, productId, quantity);
  }

  async deleteProduct(cartId, productId) {
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.deleteProduct(cartId, productId);
  }

  async updateCart(cartId, products) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.updateCart(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.updateProductQuantity(cartId, productId, quantity);
  }

  async deleteAllProducts(cartId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error("Invalid ObjectId");
    }
    return await this.dao.deleteAllProducts(cartId);
  }
}
