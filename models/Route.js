import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mode: { type: String, enum: ["bus", "train"], required: true },
  startLocation: { type: String, required: true },
  destination: { type: String, required: true },
  inMiddleStops: [{ type: String, required: true }],
  pricePerStop: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  scheduledDepartureTime: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Route", routeSchema);
