// src/models/ticket.model.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

export const TicketModel = mongoose.model("Ticket", ticketSchema);
