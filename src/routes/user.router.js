import { Router } from "express";
import passport from "passport";
import {
  login,
  logout,
  register,
  profile,
  githubResponse,
  getCurrentSession,
} from "../controllers/user.controllers.js";

const router = Router();

router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/views/profile",
    failureRedirect: "/views/login",
    failureFlash: true,
  })
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/views/login",
  }),
  githubResponse
);

router.get("/profile", profile);
router.post("/logout", logout);
router.get("/api/sessions/current", getCurrentSession);

export default router;
