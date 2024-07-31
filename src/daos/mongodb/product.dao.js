import mongoose from "mongoose";
import { ProductModel } from "./models/product.model.js";

export default class ProductDaoMongoDB {
  async getAll(filter, options = {}) {
    try {
      const { limit = 10, page = 1, sort = {} } = options;
      const response = await ProductModel.paginate(filter, {
        limit,
        page,
        sort,
        lean: true,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      // if (!mongoose.Types.ObjectId.isValid(id)) {
      //   throw new Error("Invalid ObjectId");
      // }
      console.log(id);
      const response = await ProductModel.findById(id).lean();
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
        lean: true,
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
      const response = await ProductModel.findByIdAndDelete(id).lean();
      if (!response) {
        throw new Error("Product not found");
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
