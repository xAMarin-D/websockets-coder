// src/daos/mongodb/daoFactory.js
import CartDaoMongoDB from "./cart.dao.js";
import ProductDaoMongoDB from "./product.dao.js";
// Importar otros DAOs si es necesario

const getDao = (type) => {
  switch (type) {
    case "MONGO":
      return {
        cartDao: new CartDaoMongoDB(),
        productDao: new ProductDaoMongoDB(),
        // Otros DAOs
      };
    case "FILE":
      // Implementar y retornar DAOs basados en archivos, si es necesario
      throw new Error("FILE persistence not implemented yet");
    default:
      throw new Error("Persistence type not supported");
  }
};

export default getDao;
