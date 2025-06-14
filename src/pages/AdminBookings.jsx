import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/all", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      alert("Failed to fetch admin bookings");
    }
  };

  useEffect(() => {
    if (user.role === "admin") {
      fetchAllBookings();
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white shadow p-4 rounded-md border border-gray-300"
            >
              <p>
                <strong>User:</strong> {ticket.user?.email || "N/A"}
              </p>
              <p>
                <strong>Mode:</strong> {ticket.mode.toUpperCase()}
              </p>
              <p>
                <strong>Route:</strong> {ticket.from} → {ticket.to}
              </p>
              <p>
                <strong>Date:</strong> {ticket.date} &nbsp; <strong>Time:</strong>{" "}
                {ticket.time}
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

export default AdminDashboard;
