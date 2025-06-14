// seeder/routeSeeder.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "../models/Route.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const routes = [
  // BUSES
  {
    name: "Bharat Deluxe",
    mode: "bus",
    startLocation: "Chennai",
    destination: "Madurai",
    inMiddleStops: ["Chennai", "Trichy", "Dindigul", "Madurai"],
    pricePerStop: 120,
    totalSeats: 40,
    availableSeats: 40,
    scheduledDepartureTime: "07:00 AM"
  },
  {
    name: "TN Super Bus",
    mode: "bus",
    startLocation: "Coimbatore",
    destination: "Salem",
    inMiddleStops: ["Coimbatore", "Erode", "Salem"],
    pricePerStop: 100,
    totalSeats: 45,
    availableSeats: 45,
    scheduledDepartureTime: "06:30 AM"
  },
  {
    name: "KPN Express",
    mode: "bus",
    startLocation: "Bangalore",
    destination: "Chennai",
    inMiddleStops: ["Bangalore", "Vellore", "Kanchipuram", "Chennai"],
    pricePerStop: 130,
    totalSeats: 35,
    availableSeats: 35,
    scheduledDepartureTime: "08:00 AM"
  },
  {
    name: "Greenline Travels",
    mode: "bus",
    startLocation: "Chennai",
    destination: "Tirunelveli",
    inMiddleStops: ["Chennai", "Villupuram", "Trichy", "Tirunelveli"],
    pricePerStop: 150,
    totalSeats: 50,
    availableSeats: 50,
    scheduledDepartureTime: "09:00 AM"
  },
  {
    name: "Parveen Tours",
    mode: "bus",
    startLocation: "Salem",
    destination: "Madurai",
    inMiddleStops: ["Salem", "Namakkal", "Karur", "Madurai"],
    pricePerStop: 110,
    totalSeats: 40,
    availableSeats: 40,
    scheduledDepartureTime: "07:15 AM"
  },

  // TRAINS
  {
    name: "TN Express",
    mode: "train",
    startLocation: "Chennai",
    destination: "Delhi",
    inMiddleStops: ["Chennai", "Vijayawada", "Nagpur", "Bhopal", "Delhi"],
    pricePerStop: 200,
    totalSeats: 100,
    availableSeats: 100,
    scheduledDepartureTime: "06:00 AM"
  },
  {
    name: "Chennai Mail",
    mode: "train",
    startLocation: "Chennai",
    destination: "Bangalore",
    inMiddleStops: ["Chennai", "Vellore", "Bangalore"],
    pricePerStop: 150,
    totalSeats: 90,
    availableSeats: 90,
    scheduledDepartureTime: "09:30 AM"
  },
  {
    name: "Coimbatore Express",
    mode: "train",
    startLocation: "Chennai",
    destination: "Coimbatore",
    inMiddleStops: ["Chennai", "Salem", "Erode", "Coimbatore"],
    pricePerStop: 180,
    totalSeats: 80,
    availableSeats: 80,
    scheduledDepartureTime: "05:00 AM"
  },
  {
    name: "Madurai Intercity",
    mode: "train",
    startLocation: "Chennai",
    destination: "Madurai",
    inMiddleStops: ["Chennai", "Trichy", "Dindigul", "Madurai"],
    pricePerStop: 170,
    totalSeats: 75,
    availableSeats: 75,
    scheduledDepartureTime: "07:45 AM"
  },
  {
    name: "Southern Star",
    mode: "train",
    startLocation: "Coimbatore",
    destination: "Tirunelveli",
    inMiddleStops: ["Coimbatore", "Pollachi", "Madurai", "Tirunelveli"],
    pricePerStop: 160,
    totalSeats: 70,
    availableSeats: 70,
    scheduledDepartureTime: "08:30 AM"
  }
];

const seedRoutes = async () => {
  try {
    await connectDB();
    await Route.deleteMany();
    await Route.insertMany(routes);
    console.log("✅ Routes seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding routes:", err);
    process.exit(1);
  }
};

seedRoutes();
