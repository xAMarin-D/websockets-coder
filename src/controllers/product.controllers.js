import ProductService from "../services/product.services.js";
import mongoose from "mongoose";
import { HttpResponse } from "../utils/http.response.js";

const httpResponse = new HttpResponse();
const productService = new ProductService();

export const getAll = async (req, res, next) => {
  try {
    const {
      query,
      limit = 10,
      page = 1,
      sort,
      category,
      availability,
    } = req.query;

    let filter = {};
    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (availability !== undefined) {
      filter.stock = { $gt: availability > 0 ? 0 : -1 };
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort:
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
    };

    const response = await productService.getAll(filter, options);

    const result = {
      status: "success",
      payload: response.docs,
      totalDocs: response.totalDocs,
      limit: response.limit,
      totalPages: response.totalPages,
      page: response.page,
      pagingCounter: response.pagingCounter,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevPage: response.prevPage,
      nextPage: response.nextPage,
      prevLink: response.hasPrevPage
        ? `/products?limit=${limit}&page=${response.prevPage}&sort=${sort}`
        : null,
      nextLink: response.hasNextPage
        ? `/products?limit=${limit}&page=${response.nextPage}&sort=${sort}`
        : null,
    };

    res.json(result);
  } catch (error) {
    console.error("Error getting products:", error);
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const product = await productService.getById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    console.log(req.session.user);

    // Verificar si el usuario es admin o premium
    if (
      req.session.user.role === "admin" ||
      req.session.user.role === "premium"
    ) {
      // Asignar el owner del producto
      const productData = {
        ...req.body,
        owner: req.session.user.email || "admin", // Establecer el owner como el email del usuario o "admin" por defecto
      };

      const newProd = await productService.create(productData);

      if (!newProd) {
        res.status(404).json({ msg: "Error creating product" });
      } else {
        res.json(newProd);
      }
    } else {
      return res
        .status(403)
        .json({ msg: "No tienes permisos para crear productos" });
    }
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const user = req.session?.user;

    // Verificar si el usuario está en sesión
    if (!user) {
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    const { id } = req.params;

    // Validar que el ID del producto sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID de producto inválido" });
    }

    const product = await productService.getById(id);

    // Verificar si el producto existe
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Si el usuario es admin, puede eliminar cualquier producto
    if (user.role === "admin") {
      const prodDel = await productService.delete(id);
      if (!prodDel) {
        return res.status(500).json({ msg: "Error al eliminar producto" });
      }
      return res.json({
        msg: "Producto eliminado exitosamente",
        product: prodDel,
      });
    }

    // Si el usuario es premium, solo puede eliminar sus propios productos
    if (user.role === "premium") {
      if (product.owner === user.email) {
        const prodDel = await productService.delete(id);
        if (!prodDel) {
          return res.status(500).json({ msg: "Error al eliminar producto" });
        }
        return res.json({
          msg: "Producto eliminado exitosamente",
          product: prodDel,
        });
      } else {
        return res
          .status(403)
          .json({ msg: "No tienes permiso para eliminar este producto" });
      }
    }

    // Si el usuario no es admin ni premium
    return res
      .status(403)
      .json({
        msg: "No tienes los permisos necesarios para eliminar productos",
      });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    res
      .status(500)
      .json({ msg: "Error interno del servidor", error: error.message });
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const prodUpd = await productService.update(id, req.body);
    if (!prodUpd) res.status(404).json({ msg: "Error updating product" });
    else res.json(prodUpd);
  } catch (error) {
    next(error);
  }
};

export const renderProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }
    const product = await productService.getById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.render("product", { product });
  } catch (error) {
    next(error);
  }
};
