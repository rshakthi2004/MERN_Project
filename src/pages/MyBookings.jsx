import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      alert("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white shadow-md p-4 rounded-md border border-gray-200"
            >
              <p>
                <strong>Mode:</strong> {ticket.mode.toUpperCase()}
              </p>
              <p>
                <strong>From:</strong> {ticket.from} → <strong>To:</strong>{" "}
                {ticket.to}
              </p>
              <p>
                <strong>Date:</strong> {ticket.date} &nbsp;
                <strong>Time:</strong> {ticket.time}
              </p>
              <p>
                <strong>Seats:</strong> {ticket.seats}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  {ticket.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
