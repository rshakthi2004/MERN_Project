import express from "express";
import { createBooking, getUserBookings } from "../controllers/bookingController.js";
import  protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);

export default router;