import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  seatsBooked: { type: Number, required: true },
  price: { type: Number, required: true },
  journeyDate: { type: Date, required: true },
  status: { type: String, enum: ["Booked", "Cancelled"], default: "Booked" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
