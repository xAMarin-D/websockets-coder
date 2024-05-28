import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";

export default class ProductService {
  constructor() {
    this.dao = new ProductDaoMongoDB();
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async create(obj) {
    return await this.dao.create(obj);
  }

  async update(id, obj) {
    return await this.dao.update(id, obj);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}
