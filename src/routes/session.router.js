import { Router } from "express";

const router = Router();

router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ msg: "No estás autenticado" });
  }
});

export default router;
