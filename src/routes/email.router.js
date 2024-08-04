import { Router } from "express";
import { sendGmailWithTicket } from "../controllers/email.controller.js";

const router = Router();

router.post("/gmail", sendGmailWithTicket); // Cambia a sendGmailWithTicket

export default router;
