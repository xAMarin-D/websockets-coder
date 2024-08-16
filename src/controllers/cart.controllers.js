import CartService from "../services/cart.service.js";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import ProductService from "../services/product.services.js";

const cartService = new CartService();
const productService = new ProductService();

export const getAll = async (req, res, next) => {
  try {
    const response = await cartService.getAll();
    res.json(response);
  } catch (error) {
    console.error("Error obteniendo el carrito por ID:", error);
    logger.error(`Error obteniendo el carrito por ID: ${error.message}`, {
      error,
    });
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
    if (!cart) res.status(404).json({ msg: "Carro no encontrado" });
    else res.json(cart);
  } catch (error) {
    console.error("Error obteniendo el carrito por ID:", error);
    logger.error(`Error obteniendo el carrito por ID: ${error.message}`, {
      error,
    });
    next(error.message);
  }
};

export const create = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    const newCart = await cartService.create(req.body);
    if (!newCart) {
      res.status(404).json({ msg: "Error creating cart" });
    } else {
      res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Error creando el carrito:", error);
    logger.error(`Error creando el carrito: ${error.message}`, { error });
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
    const { productId } = req.params;
    const { quantity } = req.params;
    const quantityInt = parseInt(quantity, 10) || 1;

    const user = req.session.user;

    // Verificar si el ID del producto es válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "ID de producto inválido" });
    }

    // Verificar si el usuario está autenticado
    if (!user) {
      return httpResponse.Unauthorized(res, "Usuario no autenticado");
    }

    // Obtener el carrito del usuario
    const cartId = user.cartId;
    if (!cartId) {
      return res.status(400).json({ msg: "No hay un carrito activo" });
    }

    // Obtener el producto que se va a agregar al carrito
    const product = await productService.getById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Si el usuario es premium, no puede agregar productos que él mismo creó
    if (user.role === "premium" && product.owner === user.email) {
      return res.status(403).json({
        msg: "No puedes agregar productos que tú has creado a tu carrito",
      });
    }

    // Agregar el producto al carrito
    const updatedCart = await cartService.addProductToCart(
      cartId,
      productId,
      quantityInt
    );
    console.log(cartId);

    res.json(updatedCart);
  } catch (error) {
    console.error("Error en addProductToCart:", error);
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
    const { quantity } = req.params;
    const quantityInt = parseInt(quantity, 10) || 1;
    const updatedCart = await cartService.updateProductQuantity(
      id,
      pid,
      quantityInt
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
