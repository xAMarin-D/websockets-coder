import { Router } from "express";
import passport from "passport";
import {
  login,
  logout,
  register,
  profile,
  githubResponse,
  getCurrentSession,
  requestPasswordReset,
  resetPassword,
  changeUserRoleToPremium,
  uploadDocuments,
  getAllUsers,
  deleteInactiveUsers,
} from "../controllers/user.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";
import upload from "../middlewares/multer.js";

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

router.post("/loginp", login);
router.post("/logoutp", logout);
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

// Solicitar res(debe estar logueado)
router.post("/request-password-reset", isAuth, requestPasswordReset);

// Restablecer pass
router.post("/reset-password/:token", resetPassword);

router.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  res.render("reset-password", { token });
});

//PF4 Ruta exclusiva
router.put("/premium/:uid", changeUserRoleToPremium);

//Ruta para documents
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "identification", maxCount: 1 },
    { name: "address_proof", maxCount: 1 },
    { name: "account_statement", maxCount: 1 },
  ]),
  uploadDocuments
);

router.get("/", getAllUsers);
router.delete("/inactive", deleteInactiveUsers);

export default router;
