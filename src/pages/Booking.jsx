import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBus, FaTrain, FaSearch, FaFilter, FaTimes, FaArrowRight, FaUser, FaCalendarAlt, FaClock, FaChair } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { GiPriceTag } from "react-icons/gi";

const Booking = () => {
  const [mode, setMode] = useState("bus");
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1
  });
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    departureTime: ""
  });
  const [showFilters, setShowFilters] = useState(false);

// Get today's date in YYYY-MM-DD format (for date input min attribute)
const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/routes?mode=${mode}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRoutes(res.data);
        setFilteredRoutes(res.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, [mode]);

  useEffect(() => {
    applyFilters();
  }, [filters, routes]);

  const applyFilters = () => {
    let result = [...routes];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(route => 
        route.name.toLowerCase().includes(searchTerm) ||
        route.startLocation.toLowerCase().includes(searchTerm) ||
        route.destination.toLowerCase().includes(searchTerm)
    )}
    
    if (filters.minPrice) {
      result = result.filter(route => route.pricePerStop >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(route => route.pricePerStop <= Number(filters.maxPrice));
    }
    
    if (filters.departureTime) {
      result = result.filter(route => 
        route.scheduledDepartureTime.includes(filters.departureTime));
    }
    
    setFilteredRoutes(result);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setBookingData(prev => ({
      ...prev,
      from: route.startLocation,
      to: route.destination,
      date: todayFormatted // Set default date to today
    }));
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedRoute || !bookingData.from || !bookingData.to || !bookingData.date) {
      alert("Please fill all required fields.");
      return;
    }

    const selectedDate = new Date(bookingData.date);
    if (selectedDate < new Date(todayFormatted)) {
      alert("Please select a date today or in the future.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          routeId: selectedRoute._id,
          from: bookingData.from,
          to: bookingData.to,
          journeyDate: bookingData.date,
          seatsBooked: bookingData.seats,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(`Booking successful! ${res.data.message}`);
      setShowBookingModal(false);
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  const calculatePrice = () => {
    if (!selectedRoute || !bookingData.from || !bookingData.to) return 0;
    
    const stops = selectedRoute.inMiddleStops;
    const fromIndex = stops.indexOf(bookingData.from);
    const toIndex = stops.indexOf(bookingData.to);
    const stopsCount = Math.abs(toIndex - fromIndex);
    
    return stopsCount * selectedRoute.pricePerStop * bookingData.seats;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Book Your {mode === "bus" ? "Bus" : "Train"} Ticket
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from hundreds of {mode === "bus" ? "bus" : "train"} routes across the country
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setMode("bus")}
              className={`px-6 py-2 rounded-md flex items-center gap-2 transition-all ${mode === "bus" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaBus /> Bus
            </button>
            <button
              onClick={() => setMode("train")}
              className={`px-6 py-2 rounded-md flex items-center gap-2 transition-all ${mode === "train" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaTrain /> Train
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${mode === "bus" ? "buses" : "trains"}...`}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaFilter /> Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GiPriceTag className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Min"
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GiPriceTag className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Max"
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.departureTime}
                  onChange={(e) => setFilters({...filters, departureTime: e.target.value})}
                >
                  <option value="">Any Time</option>
                  <option value="AM">Morning (AM)</option>
                  <option value="PM">Afternoon/Evening (PM)</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Routes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <motion.div
              key={route._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{route.name}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      {route.mode === "bus" ? <FaBus className="mr-1" /> : <FaTrain className="mr-1" />}
                      <span className="text-sm">{route.mode.charAt(0).toUpperCase() + route.mode.slice(1)}</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ₹{route.pricePerStop}/stop
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <div className="flex items-center text-gray-700">
                      <IoLocationSharp className="text-green-500 mr-2" />
                      <span>{route.startLocation}</span>
                    </div>
                    <div className="h-4 border-l-2 border-dotted border-gray-300 ml-2 my-1"></div>
                    <div className="flex items-center text-gray-700">
                      <IoLocationSharp className="text-red-500 mr-2" />
                      <span>{route.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Departure</div>
                    <div className="font-medium">{route.scheduledDepartureTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Available Seats</div>
                    <div className="font-medium">{route.availableSeats}/{route.totalSeats}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleRouteSelect(route)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Book Now <FaArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No {mode === "bus" ? "buses" : "trains"} found matching your criteria</div>
            <button 
              onClick={() => setFilters({
                search: "",
                minPrice: "",
                maxPrice: "",
                departureTime: ""
              })}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedRoute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Book Your Ticket</h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{selectedRoute.name}</span>
                    <span className="text-blue-600 font-medium">
                      {selectedRoute.mode === "bus" ? <FaBus className="inline mr-1" /> : <FaTrain className="inline mr-1" />}
                      {selectedRoute.mode.charAt(0).toUpperCase() + selectedRoute.mode.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <IoLocationSharp className="text-green-500 mr-2" />
                        <span>{selectedRoute.startLocation}</span>
                      </div>
                      <div className="h-4 border-l-2 border-dotted border-gray-300 ml-2 my-1"></div>
                      <div className="flex items-center">
                        <IoLocationSharp className="text-red-500 mr-2" />
                        <span>{selectedRoute.destination}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Departure</div>
                      <div className="font-medium">{selectedRoute.scheduledDepartureTime}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={bookingData.from}
                      onChange={(e) => setBookingData({...bookingData, from: e.target.value})}
                    >
                      <option value="" disabled>Select departure</option>
                      {selectedRoute.inMiddleStops.map((stop, i) => (
                        <option key={i} value={stop}>{stop}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={bookingData.to}
                      onChange={(e) => setBookingData({...bookingData, to: e.target.value})}
                    >
                      <option value="" disabled>Select destination</option>
                      {selectedRoute.inMiddleStops.map((stop, i) => (
                        <option key={i} value={stop}>{stop}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        />
                      </div>
                    </div>
                    
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        max={selectedRoute.availableSeats}
                        className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Number of seats"
                        value={bookingData.seats}
                        onChange={(e) => setBookingData({...bookingData, seats: e.target.value})}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedRoute.availableSeats} seats available
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Total Price</div>
                      <div className="text-2xl font-bold text-blue-600">₹{calculatePrice()}</div>
                    </div>
                    <button
                      onClick={handleBookingSubmit}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      Confirm Booking <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;