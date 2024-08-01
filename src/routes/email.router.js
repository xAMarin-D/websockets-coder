import { Router } from "express";
import { sendGmailWithTicket } from "../controllers/email.controller.js"; // Importa la función correcta

const router = Router();

// Usar la función correcta en las rutas necesarias
// router.post("/send", sendMailEthereal); // Si existe otro método de email
router.post("/gmail", sendGmailWithTicket); // Cambia a sendGmailWithTicket

export default router;
