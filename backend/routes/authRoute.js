import express from "express";
import {adminLogin, googleLogin, login, logOut , registration  } from "../controllers/authcontroller.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/registration", registration);
router.post("/login", login);
router.get("/logout", logOut);
router.post("/google", googleLogin);
router.post("/adminlogin", adminLogin);
router.get("/getcurrentuser", getCurrentUser);
export default router;

