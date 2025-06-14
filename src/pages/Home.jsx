import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaBus, FaTrain, FaArrowRight, FaUser, FaUserShield } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { HiTicket } from "react-icons/hi2";
import { MdOutlineDashboard } from "react-icons/md";

const Home = () => {
  const { user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center">
        <motion.div 
          className="text-center max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
            variants={itemVariants}
          >
            Fast & Easy Ticket Booking
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            Travel Smarter with <span className="text-blue-600">Seamless</span> Bookings
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Book your bus or train tickets in seconds. Enjoy real-time availability, secure payments, and instant confirmations.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={itemVariants}
          >
            {!user && (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FiLogIn /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-700 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200"
                >
                  <FaUser /> Register
                </Link>
              </>
            )}

            {user && user.role === "user" && (
              <Link
                to="/booking"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <HiTicket /> Book Now <FaArrowRight className="text-sm" />
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MdOutlineDashboard /> Admin Dashboard <FaArrowRight className="text-sm" />
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaBus className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Bus Tickets</h3>
            <p className="text-gray-600">Book comfortable bus rides across hundreds of routes with various operators.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <FaTrain className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Train Tickets</h3>
            <p className="text-gray-600">Secure your train seats with real-time availability and instant confirmation.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FaUserShield className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Booking</h3>
            <p className="text-gray-600">Your transactions are 100% secure with our encrypted payment gateway.</p>
          </div>
        </motion.div>

        {/* Testimonial/Stats Section */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Why Choose Us?</h3>
              <p className="opacity-90">Thousands of travelers trust our platform every day</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-80">Daily Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm opacity-80">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Customer Support</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;