import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "messages" }
);

export const MessageModel = mongoose.model("Message", messageSchema);
