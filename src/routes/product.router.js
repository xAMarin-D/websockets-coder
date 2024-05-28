import { Router } from "express";
import ProductService from "../services/product.services.js";

const router = Router();
const productService = new ProductService();

import { productValidator } from "../middlewares/validator.js";

router.get("/", async (req, res) => {
  try {
    const products = await productService.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.post("/", productValidator, async (req, res) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.get("/:idProduct", async (req, res) => {
  try {
    const { idProduct } = req.params;
    const product = await productService.getById(idProduct);
    if (!product) res.status(404).json({ msg: "Product not found" });
    else res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.put("/:idProduct", async (req, res) => {
  try {
    const { idProduct } = req.params;
    const productUpd = await productService.update(idProduct, req.body);
    if (!productUpd) res.status(404).json({ msg: "Error updating product" });
    else res.status(200).json(productUpd);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.delete("/:idProduct", async (req, res) => {
  try {
    const { idProduct } = req.params;
    const delProduct = await productService.delete(idProduct);
    if (!delProduct) res.status(404).json({ msg: "Error delete product" });
    else
      res
        .status(200)
        .json({ msg: `Product id: ${idProduct} deleted succesfully` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
