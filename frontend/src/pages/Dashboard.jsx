import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plane,
  LayoutDashboard,
  Ticket,
  Search,
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  LogOut,
  UserRound,
  Wallet,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("bookings/");
        setBookings(response.data);
      } catch (err) {
        setError("Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const confirmedBookings = bookings.filter(
    (booking) => booking.booking_status === "confirmed"
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.booking_status === "pending"
  );

  const totalSpent = confirmedBookings
    .filter((booking) => booking.payment_status === "paid")
    .reduce(
      (total, booking) => total + Number(booking.total_price || 0),
      0
    );

  const recentBookings = [...bookings].slice(0, 4);

  return (
    <div className="dashboard-layout">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <Link to="/" className="dashboard-logo">
          <Plane size={28} />
          <span>AirBooking</span>
        </Link>

        <div className="sidebar-label">MENU</div>

        <nav className="sidebar-nav">

          <Link to="/dashboard" className="sidebar-link active">
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          <Link to="/" className="sidebar-link">
            <Search size={19} />
            Search Flights
          </Link>

          <Link to="/my-trips" className="sidebar-link">
            <Ticket size={19} />
            My Trips
          </Link>

          <Link to="/manage-booking" className="sidebar-link">
            <CalendarDays size={19} />
            Manage Booking
          </Link>

          <Link to="/live-status" className="sidebar-link">
            <Plane size={19} />
            Live Flight Status
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-help">
            <div className="help-icon">
              <UserRound size={20} />
            </div>

            <h4>Need assistance?</h4>
            <p>We're here to help you with your journey.</p>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <header className="dashboard-topbar">

          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div>
            <span className="topbar-subtitle">YOUR TRAVEL SPACE</span>
            <h2>My Dashboard</h2>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">
              {(user?.username || "U").charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user?.username || "Traveler"}</strong>
              <span>Traveler Account</span>
            </div>
          </div>

        </header>

        {/* WELCOME BANNER */}
        <section className="welcome-banner">

          <div className="welcome-content">
            <span>WELCOME TO AIRBOOKING</span>

            <h1>
              Hello, {user?.username || "Traveler"}!
            </h1>

            <p>
              Your next adventure is just a few clicks away.
              Discover new destinations and travel with confidence.
            </p>

            <Link to="/" className="welcome-btn">
              Explore Flights
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="welcome-decoration">
            <Plane size={130} />
          </div>

        </section>

        {/* STATISTICS */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon blue">
              <Ticket size={22} />
            </div>

            <div>
              <span>Total Bookings</span>
              <h2>{bookings.length}</h2>
              <small>All your reservations</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Plane size={22} />
            </div>

            <div>
              <span>Confirmed Trips</span>
              <h2>{confirmedBookings.length}</h2>
              <small>Successfully confirmed</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon gold">
              <Clock size={22} />
            </div>

            <div>
              <span>Pending Bookings</span>
              <h2>{pendingBookings.length}</h2>
              <small>Awaiting confirmation</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Wallet size={22} />
            </div>

            <div>
              <span>Total Spent</span>
              <h2>₹{totalSpent.toLocaleString("en-IN")}</h2>
              <small>Successful payments</small>
            </div>
          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="quick-actions-section">

          <div className="section-heading">
            <div>
              <span>GET STARTED</span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="quick-actions">

            <Link to="/" className="quick-action-card">
              <div className="quick-icon">
                <Search size={23} />
              </div>

              <div>
                <h3>Book a Flight</h3>
                <p>Find your next destination</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/my-trips" className="quick-action-card">
              <div className="quick-icon">
                <Ticket size={23} />
              </div>

              <div>
                <h3>My Trips</h3>
                <p>View your bookings</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/manage-booking" className="quick-action-card">
              <div className="quick-icon">
                <CalendarDays size={23} />
              </div>

              <div>
                <h3>Manage Booking</h3>
                <p>Manage your reservations</p>
              </div>

              <ArrowRight size={19} />
            </Link>

          </div>

        </section>

        {/* RECENT BOOKINGS */}
        <section className="recent-bookings-section">

          <div className="section-heading">
            <div>
              <span>YOUR RESERVATIONS</span>
              <h2>Recent Bookings</h2>
            </div>

            <Link to="/my-trips" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (

            <div className="booking-message">
              Loading your bookings...
            </div>

          ) : error ? (

            <div className="booking-message error-message">
              {error}
            </div>

          ) : recentBookings.length === 0 ? (

            <div className="empty-bookings">

              <div className="empty-icon">
                <Plane size={35} />
              </div>

              <h3>No bookings yet</h3>

              <p>
                You haven't booked any flights.
                Start exploring and plan your next journey.
              </p>

              <Link to="/" className="empty-booking-btn">
                Search Flights <ArrowRight size={17} />
              </Link>

            </div>

          ) : (

            <div className="booking-list">

              {recentBookings.map((booking) => (

                <div className="booking-row" key={booking.id}>

                  <div className="booking-flight-icon">
                    <Plane size={23} />
                  </div>

                  <div className="booking-route">
                    <h3>
                      {booking.departure_city}
                      <ArrowRight size={15} />
                      {booking.arrival_city}
                    </h3>

                    <span>
                      {booking.flight_number} · {booking.airline}
                    </span>
                  </div>

                  <div className="booking-date">
                    <CalendarDays size={15} />
                    {new Date(booking.created_at).toLocaleDateString("en-IN")}
                  </div>

                  <div className="booking-price">
                    ₹{Number(booking.total_price).toLocaleString("en-IN")}
                  </div>

                  <span className={`booking-status ${booking.booking_status}`}>
                    {booking.booking_status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <span>© 2026 AirBooking. All rights reserved.</span>
          <span>Travel smarter. Travel better.</span>
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;