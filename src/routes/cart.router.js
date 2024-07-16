import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
} from "../controllers/cart.controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.post("/:id/products/:productId/:quantity", addProductToCart);
router.delete("/:id/products/:pid", deleteProductFromCart);
router.put("/:id", updateCart);
router.put("/:id/products/:pid", updateProductQuantity);
router.delete("/:id/products", deleteAllProductsFromCart);
router.post("/add-product/:id", addProductToCart);

export default router;
