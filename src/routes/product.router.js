import express from "express";
import {
  getAll,
  getById as getProductById,
  create,
  update,
  remove,
} from "../controllers/product.controllers.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getProductById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

router.get("/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getProductById(req, res, next); // Pasar req, res, next
    res.render("product", { product: product });
  } catch (error) {
    next(error);
  }
});

export default router;
