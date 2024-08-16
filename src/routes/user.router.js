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
import { UserModel } from "../daos/mongodb/models/user.model.js";

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

//login postman
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

router.put("/premium/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;

    // Buscar el usuario en la base de datos por su ID
    const user = await UserModel.findById(uid);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Cambiar el rol del usuario entre 'user' y 'premium'
    const newRole = user.role === "user" ? "premium" : "user";
    user.role = newRole;

    // Guardar los cambios en la base de datos
    const updatedUser = await user.save();

    res.json({
      msg: `El rol del usuario ha sido cambiado a ${newRole}`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
