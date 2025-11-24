import express from "express";
import isAuth from "../middleware/config/isAuth.js";
import { allOrders, placeOrder, placeOrderRazorpay, updateStatus, userOrders, verifyRazorpayPayment } from "../controllers/orderController.js";
import adminAuth from "../middleware/config/adminAuth.js";

const router = express.Router();
//for User
// Place order
router.post("/placeorder", isAuth, placeOrder);
router.post("/razorpay", isAuth, placeOrderRazorpay);
// Verification endpoint is public because verification is secured by Razorpay signature
// The controller verifies the HMAC signature using RAZORPAY_KEY_SECRET, so an auth cookie
// is not required here (the order is updated using the order id found in Razorpay data).
router.post("/verifyRazorpay", verifyRazorpayPayment);
router.post("/userorder", isAuth, userOrders);


//for Admin
router.post("/list", adminAuth, allOrders);
router.post("/status", adminAuth, updateStatus);


export default router;
