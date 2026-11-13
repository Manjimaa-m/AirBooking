import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Search,
  Ticket,
  CalendarDays,
  MapPin,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import "./ManageBooking.css";

function ManageBooking() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [reference, setReference] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("bookings/");
      const data = response.data;

      setBookings(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load bookings. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const searchBooking = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSelectedBooking(null);

    const searchValue = reference.trim().toUpperCase();

    if (!searchValue) {
      setError("Please enter your booking reference.");
      return;
    }

    const booking = bookings.find(
      (item) =>
        item.booking_reference?.toUpperCase() === searchValue
    );

    if (!booking) {
      setError("No booking found with this reference.");
      return;
    }

    setSelectedBooking(booking);
  };

  const cancelBooking = async () => {
    if (!selectedBooking) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${selectedBooking.booking_reference}?`
    );

    if (!confirmed) return;

    setCancelling(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        `bookings/${selectedBooking.id}/cancel/`
      );

      setSuccess(response.data.message || "Booking cancelled successfully.");

      setSelectedBooking((previous) => ({
        ...previous,
        booking_status: "cancelled",
      }));

      await fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to cancel this booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const formatTime = (value) =>
    value
      ? new Date(value).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";

  return (
    <div className="manage-booking-page">

      <header className="manage-navbar">
        <div className="manage-logo" onClick={() => navigate("/")}>
          <Plane size={24} />
          <span>Air<span>Booking</span></span>
        </div>

        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </header>

      <main className="manage-container">

        <button
          className="manage-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="manage-heading">
          <span>BOOKING MANAGEMENT</span>
          <h1>Manage Your Booking</h1>
          <p>Find your reservation and manage your flight details.</p>
        </div>

        <section className="manage-search-card">

          <div className="manage-search-icon">
            <Ticket size={26} />
          </div>

          <h2>Find Your Booking</h2>

          <p>
            Enter your booking reference to view your reservation.
          </p>

          <form onSubmit={searchBooking}>
            <div className="manage-input-wrapper">
              <Search size={19} />

              <input
                type="text"
                placeholder="Enter booking reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}>
              Search Booking
              <Search size={17} />
            </button>
          </form>

          {loading && <p>Loading your bookings...</p>}

        </section>

        {error && (
          <div className="manage-alert error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="manage-alert success">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {selectedBooking && (
          <section className="manage-result-card">

            <div className="manage-result-header">
              <div>
                <span>BOOKING REFERENCE</span>
                <h2>{selectedBooking.booking_reference}</h2>
              </div>

              <span
                className={`manage-status ${selectedBooking.booking_status}`}
              >
                {selectedBooking.booking_status}
              </span>
            </div>

            <div className="manage-airline">
              <div className="manage-airline-icon">
                <Plane size={22} />
              </div>

              <div>
                <h3>{selectedBooking.airline}</h3>
                <p>{selectedBooking.flight_number}</p>
              </div>
            </div>

            <div className="manage-route">

              <div>
                <span>DEPARTURE</span>
                <h2>{formatTime(selectedBooking.departure_time)}</h2>
                <h4>{selectedBooking.departure_city}</h4>
                <p>{formatDate(selectedBooking.departure_time)}</p>
              </div>

              <div className="manage-route-line">
                <div></div>
                <Plane size={19} />
                <div></div>
              </div>

              <div className="manage-arrival">
                <span>ARRIVAL</span>
                <h2>{formatTime(selectedBooking.arrival_time)}</h2>
                <h4>{selectedBooking.arrival_city}</h4>
                <p>{formatDate(selectedBooking.arrival_time)}</p>
              </div>

            </div>

            <div className="manage-details-grid">

              <div>
                <CalendarDays size={17} />
                <span>
                  {formatDate(selectedBooking.created_at)}
                </span>
                <small>Booking Date</small>
              </div>

              <div>
                <Ticket size={17} />
                <span>{selectedBooking.number_of_seats}</span>
                <small>Passengers</small>
              </div>

              <div>
                <MapPin size={17} />
                <span>{selectedBooking.payment_status}</span>
                <small>Payment Status</small>
              </div>

              <div>
                <Clock size={17} />
                <span>{formatPrice(selectedBooking.total_price)}</span>
                <small>Total Amount</small>
              </div>

            </div>

            <div className="manage-actions">

              {selectedBooking.booking_status === "confirmed" && (
                <button
                  className="manage-cancel-btn"
                  onClick={cancelBooking}
                  disabled={cancelling}
                >
                  <XCircle size={17} />
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}

              {selectedBooking.booking_status === "cancelled" && (
                <div className="manage-cancelled-note">
                  <CheckCircle size={17} />
                  This booking has been cancelled.
                </div>
              )}

              {selectedBooking.booking_status === "confirmed" &&
                selectedBooking.payment_status === "paid" && (
                  <button
                    className="manage-ticket-btn"
                    onClick={() =>
                      navigate("/my-trips")
                    }
                  >
                    View E-Ticket
                  </button>
                )}

            </div>

          </section>
        )}

        <div className="manage-help">
          <RefreshCw size={20} />
          <div>
            <h3>Need help with your reservation?</h3>
            <p>
              Search using the booking reference shown in your confirmation.
            </p>
          </div>
        </div>

      </main>

      <footer className="manage-footer">
        © 2026 AirBooking. All rights reserved.
      </footer>

    </div>
  );
}

export default ManageBooking;