import express from "express";
import {
  createBooking,
  getAllBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyUser, createBooking); // Create a booking
router.get("/:id", verifyUser, getBooking); // Get a single booking
router.get("/", verifyAdmin, getAllBooking); // Get all bookings
router.put("/:id", verifyUser, updateBooking); // Update a booking
router.delete("/:id", verifyUser, deleteBooking); // Delete a booking

export default router;
