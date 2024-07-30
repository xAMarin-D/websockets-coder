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
  purchaseCart,
} from "../controllers/cart.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

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
router.post("/:id/purchase", isAuth, purchaseCart);
export default router;
