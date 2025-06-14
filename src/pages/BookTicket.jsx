import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BookTicket = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    mode: "bus",
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/bookings",
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Ticket Booked Successfully!");
      setForm({ mode: "bus", from: "", to: "", date: "", time: "", seats: 1 });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Book a Ticket</h2>

        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          className="input"
        >
          <option value="bus">Bus</option>
          <option value="train">Train</option>
        </select>

        <input
          type="text"
          name="from"
          placeholder="From"
          value={form.from}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          type="text"
          name="to"
          placeholder="To"
          value={form.to}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={form.seats}
          onChange={handleChange}
          min="1"
          required
          className="input"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Book Ticket
        </button>
      </form>
    </div>
  );
};

export default BookTicket;
