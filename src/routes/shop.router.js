import express from "express";
import {
  renderLogin,
  renderRegister,
  renderProducts,
  renderProductDetail,
  renderCart,
} from "../controllers/shop.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/login", renderLogin);
router.get("/register", renderRegister);
router.get("/products", isAuth, renderProducts);
router.get("/product/:id", isAuth, renderProductDetail);
router.get("/cart", isAuth, renderCart);

router.get("/", (req, res) => {
  res.redirect("/login");
});

export default router;
