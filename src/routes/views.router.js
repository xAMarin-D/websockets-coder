// src/routes/views.router.js
import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/views/login");
  }
  res.render("profile", { user: req.user });
});

router.get("/products", (req, res) => {
  res.render("products");
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

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
