// src/routes/session.router.js
import { Router } from "express";
import { getCurrentSession } from "../controllers/user.controllers.js";

const router = Router();

router.get("/current", getCurrentSession);

export default router;
