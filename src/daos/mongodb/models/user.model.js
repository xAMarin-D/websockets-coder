import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  githubId: {
    type: String,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Carts",
  },
});

export const UserModel = model("users2", userSchema);
