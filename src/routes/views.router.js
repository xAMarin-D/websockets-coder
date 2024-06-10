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
export default router;
