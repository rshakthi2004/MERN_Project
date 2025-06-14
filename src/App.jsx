import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BookTicket from "./pages/BookTicket";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/history" element={<BookingHistory />} />
       

        {/* Admin Protected Route */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminBookings />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
