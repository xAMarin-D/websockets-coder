import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  renderProduct,
} from "../controllers/product.controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

router.get("/product/:id", renderProduct);

export default router;
