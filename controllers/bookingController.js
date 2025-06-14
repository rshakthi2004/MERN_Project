import Booking from "../models/Booking.js";
import Route from "../models/Route.js";

export const createBooking = async (req, res) => {
  const { routeId, from, to, seatsBooked, journeyDate } = req.body;
  const userId = req.user._id;

  try {
    const route = await Route.findById(routeId);
    if (!route) return res.status(404).json({ message: "Route not found" });

    const stops = route.inMiddleStops;
    const fromIndex = stops.indexOf(from);
    const toIndex = stops.indexOf(to);

    // Validate the stop selection
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
      return res.status(400).json({ message: "Invalid stops selection" });
    }

    // Check if enough seats are available
    if (route.availableSeats < seatsBooked) {
      return res.status(400).json({ message: "Not enough available seats" });
    }

    // Ensure route.pricePerStop is a valid number
    const pricePerStop = route.pricePerStop;
    if (isNaN(pricePerStop) || pricePerStop <= 0) {
      return res.status(400).json({ message: "Invalid price per stop" });
    }

    const price = (toIndex - fromIndex) * pricePerStop * seatsBooked;

    console.log("Price Calculation:", {
      pricePerStop,
      fromIndex,
      toIndex,
      seatsBooked,
      price
    });

    // Save booking
    const booking = new Booking({
      user: userId,
      route: routeId,
      from,
      to,
      seatsBooked,
      price,
      journeyDate
    });

    await booking.save();

    // Update route seats
    route.availableSeats -= seatsBooked;
    await route.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("route");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err });
  }
};
