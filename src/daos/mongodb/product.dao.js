import mongoose from "mongoose";
import { ProductModel } from "./models/product.model.js";

export default class ProductDaoMongoDB {
  async getAll() {
    try {
      const response = await ProductModel.find({});
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
      const response = await ProductModel.findById(id);
      if (!response) {
        throw new Error("Product not found");
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(obj) {
    try {
      const response = await ProductModel.create(obj);
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
      const response = await ProductModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
      if (!response) {
        throw new Error("Product not found");
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
      const response = await ProductModel.findByIdAndDelete(id);
      if (!response) {
        throw new Error("Product not found");
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
