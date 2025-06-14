import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBus, FaTrain, FaSearch, FaCalendarAlt, FaUser, FaReceipt, FaPrint, FaTrash, FaDownload } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { GiPriceTag } from "react-icons/gi";
import { MdDirectionsTransit } from "react-icons/md";
import { format, parseISO } from "date-fns";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../assets/logo.png'; // Make sure to add your logo in assets

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e40af',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    width: '40%',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '60%',
    textAlign: 'right',
  },
  routeContainer: {
    marginTop: 15,
  },
  routeStop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    fontSize: 8,
  },
  activeStop: {
    backgroundColor: '#1e40af',
    color: 'white',
  },
  stopName: {
    fontSize: 10,
  },
  activeStopName: {
    fontWeight: 'bold',
    color: '#1e40af',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  modeBadge: {
    backgroundColor: '#1e40af',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    marginLeft: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    marginLeft: 5,
  },
});

// PDF Document Component
const BookingPDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>TicketExpress</Text>
          <Text style={styles.subtitle}>Booking Confirmation</Text>
        </View>
        <Text style={styles.subtitle}>
          Booking ID: {booking._id.slice(-8).toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Journey Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Route:</Text>
          <Text style={styles.value}>
            {booking.route.name}
            <Text style={styles.modeBadge}>
              {booking.route.mode.toUpperCase()}
            </Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{booking.from}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{booking.to}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Journey Date:</Text>
          <Text style={styles.value}>{formatDate(booking.journeyDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Departure Time:</Text>
          <Text style={styles.value}>{booking.route.scheduledDepartureTime}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Passenger Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Seats Booked:</Text>
          <Text style={styles.value}>{booking.seatsBooked}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Price per Stop:</Text>
          <Text style={styles.value}>₹{booking.route.pricePerStop}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Stops:</Text>
          <Text style={styles.value}>
            {Math.abs(
              booking.route.inMiddleStops.indexOf(booking.to) - 
              booking.route.inMiddleStops.indexOf(booking.from)
            )}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Price:</Text>
          <Text style={styles.value}>₹{booking.price}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Status</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, { color: getStatusPDFColor(booking.status) }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Booked On:</Text>
          <Text style={styles.value}>{formatDate(booking.createdAt)}</Text>
        </View>
      </View>.7

      <View style={[styles.section, styles.routeContainer]}>
        <Text style={styles.sectionTitle}>Route Stops</Text>
        {booking.route.inMiddleStops.map((stop, index) => (
          <View key={index} style={styles.routeStop}>
            <View style={[
              styles.stopIndicator,
              (stop === booking.from || stop === booking.to) && styles.activeStop
            ]}>
              <Text>{index + 1}</Text>
            </View>
            <Text style={[
              styles.stopName,
              (stop === booking.from || stop === booking.to) && styles.activeStopName
            ]}>
              {stop}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>Thank you for choosing TicketExpress • For any queries contact support@ticketexpress.com</Text>
        <Text>Booking ID: {booking._id} • Generated on {formatDate(new Date().toISOString())}</Text>
      </View>
    </Page>
  </Document>
);

// Helper function for PDF status colors
const getStatusPDFColor = (status) => {
  switch (status.toLowerCase()) {
    case "booked": return "#16a34a";
    case "cancelled": return "#dc2626";
    case "completed": return "#2563eb";
    case "pending": return "#d97706";
    default: return "#4b5563";
  }
};

const formatDate = (dateString) => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    mode: "all",
    status: "all",
    date: ""
  });
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBookings(res.data);
        setFilteredBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, bookings]);

  const applyFilters = () => {
    let result = [...bookings];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(booking => 
        booking.route.name.toLowerCase().includes(searchTerm) ||
        booking.from.toLowerCase().includes(searchTerm) ||
        booking.to.toLowerCase().includes(searchTerm))
    }
    
    if (filters.mode !== "all") {
      result = result.filter(booking => booking.route.mode === filters.mode);
    }
    
    if (filters.status !== "all") {
      result = result.filter(booking => booking.status.toLowerCase() === filters.status.toLowerCase());
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date).toISOString().split('T')[0];
      result = result.filter(booking => 
        new Date(booking.journeyDate).toISOString().split('T')[0] === filterDate
      );
    }
    
    setFilteredBookings(result);
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "booked":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Travel History</h1>
            <p className="text-gray-600">View and manage all your bookings in one place</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <FaPrint /> Print All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <div>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.mode}
                onChange={(e) => setFilters({...filters, mode: e.target.value})}
              >
                <option value="all">All Modes</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
              </select>
            </div>
            
            <div>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <MdDirectionsTransit className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.mode !== "all" || filters.status !== "all" || filters.date
                ? "Try adjusting your filters"
                : "You haven't made any bookings yet"}
            </p>
            <button
              onClick={() => setFilters({
                search: "",
                mode: "all",
                status: "all",
                date: ""
              })}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedBooking(expandedBooking === booking._id ? null : booking._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${booking.route.mode === "bus" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                        {booking.route.mode === "bus" ? <FaBus size={24} /> : <FaTrain size={24} />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{booking.route.name}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <IoLocationSharp className="text-green-500 mr-1" />
                          <span>{booking.from}</span>
                          <span className="mx-2">→</span>
                          <IoLocationSharp className="text-red-500 mr-1" />
                          <span>{booking.to}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <div className="text-xl font-bold mt-2">₹{booking.price}</div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedBooking === booking._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <FaCalendarAlt className="text-blue-500" /> Journey Details
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">{formatDate(booking.journeyDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Departure:</span>
                                <span className="font-medium">{booking.route.scheduledDepartureTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Booked On:</span>
                                <span className="font-medium">{formatDate(booking.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <FaUser className="text-blue-500" /> Passenger Details
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Seats:</span>
                                <span className="font-medium">{booking.seatsBooked}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Price per stop:</span>
                                <span className="font-medium">₹{booking.route.pricePerStop}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Stops:</span>
                                <span className="font-medium">
                                  {Math.abs(booking.route.inMiddleStops.indexOf(booking.to) - 
                                   booking.route.inMiddleStops.indexOf(booking.from))}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <FaReceipt className="text-blue-500" /> Actions
                            </h4>
                            <div className="flex flex-col gap-2">
                              <PDFDownloadLink
                                document={<BookingPDF booking={booking} />}
                                fileName={`TicketExpress_Booking_${booking._id.slice(-8)}.pdf`}
                              >
                                {({ loading }) => (
                                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    {loading ? (
                                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    ) : (
                                      <>
                                        <FaDownload /> Download Ticket
                                      </>
                                    )}
                                  </button>
                                )}
                              </PDFDownloadLink>
                              {booking.status.toLowerCase() === "booked" && (
                                <button 
                                  onClick={() => cancelBooking(booking._id)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <FaTrash /> Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-700 mb-2">Route Stops</h4>
                          <div className="flex overflow-x-auto pb-2">
                            <div className="flex space-x-4">
                              {booking.route.inMiddleStops.map((stop, index) => (
                                <div key={index} className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                                    ${stop === booking.from || stop === booking.to ? 
                                      'bg-blue-600 text-white' : 
                                      'bg-gray-200 text-gray-700'}`}>
                                    {index + 1}
                                  </div>
                                  <span className={`mt-1 text-sm ${stop === booking.from || stop === booking.to ? 
                                    'font-medium text-blue-600' : 'text-gray-600'}`}>
                                    {stop}
                                  </span>
                                  {index < booking.route.inMiddleStops.length - 1 && (
                                    <div className="h-4 border-l-2 border-dashed border-gray-300"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;