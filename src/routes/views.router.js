import { Router } from "express";
import { profile } from "../controllers/user.controllers.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/profile", profile);

router.get("/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getById(id); // Assuming productService is correctly imported and used
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("product", { product });
  } catch (error) {
    next(error);
  }
});

export default router;
