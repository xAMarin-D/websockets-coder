import { CartModel } from "../daos/mongodb/models/cart.model.js";
import { ProductModel } from "../daos/mongodb/models/product.model.js"; // Asegúrate de importar correctamente

export default class CartService {
  async getAll() {
    try {
      return await CartModel.find({});
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getById(id) {
    try {
      return await CartModel.findById(id).populate("products.productId");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(data) {
    try {
      return await CartModel.create(data);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id, data) {
    try {
      return await CartModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id) {
    try {
      return await CartModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");

      const product = await ProductModel.findById(productId);
      if (!product) throw new Error("Product not found");

      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");

      cart.products = cart.products.filter(
        (p) => p.productId.toString() !== productId
      );

      return await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");

      cart.products = products;
      return await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");

      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity = quantity;
      }

      return await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteAllProducts(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) throw new Error("Cart not found");

      cart.products = [];
      return await cart.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
