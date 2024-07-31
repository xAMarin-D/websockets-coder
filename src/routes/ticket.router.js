import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";

const controller = new TicketController();

const router = Router();

router.post("/purchase", controller.generateTicket);

export default router;
