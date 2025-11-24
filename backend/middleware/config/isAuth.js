import jwt from "jsonwebtoken";
import User from "../../model/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // make sure token is set in cookies
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ✅ critical: set userId
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default isAuth;
