import { Router } from "express";
const router = Router();
import {
  login,
  logout,
  visit,
  infoSession,
  register,
  profile,
} from "../controllers/user.controllers.js";
import { validateLogin } from "../middlewares/validateLogin.js";

router.post("/login", login);
router.post("/register", register);
router.get("/info", validateLogin, infoSession);
router.get("/secret-endpoint", validateLogin, visit);
router.post("/logout", logout);
router.get("/profile", validateLogin, profile); // Asegúrate de que esta ruta esté protegida

export default router;
