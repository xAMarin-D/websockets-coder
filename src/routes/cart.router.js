import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  addProductToCart,
} from "../controllers/cart.controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.post("/:id/products/:productId/:quantity", addProductToCart);

export default router;
