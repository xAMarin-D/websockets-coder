import { Router } from "express";
import { profile } from "../controllers/user.controllers.js";
import { validateLogin } from "../middlewares/validateLogin.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/profile", validateLogin, profile);

export default router;
