import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // optional for Google login
  googleId: { type: String, required: false, unique: false }, // now optional!
  cartData: { type: Object, default: {} },
}, { timestamps: true, minimize: false });

const User = mongoose.model("User", userSchema);
export default User;