import getDao from "../daos/mongodb/daoFactory.js";
const { productDao } = getDao(process.env.PERSISTENCE || "MONGO");

class ProductRepository {
  async getAll() {
    return await productDao.getAll();
  }

  async getById(id) {
    return await productDao.getById(id);
  }

  async create(data) {
    return await productDao.create(data);
  }

  async update(id, data) {
    return await productDao.update(id, data);
  }

  async delete(id) {
    return await productDao.delete(id);
  }
}

export default new ProductRepository();
