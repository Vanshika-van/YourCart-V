import express from "express";
import { getAdmin, getCurrentUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/config/adminAuth.js";

const router = express.Router();

// Protect getcurrentuser route with JWT middleware
router.get("/getcurrentuser", authMiddleware, getCurrentUser);
router.post("/getadmin", adminAuth, getAdmin);

export default router;