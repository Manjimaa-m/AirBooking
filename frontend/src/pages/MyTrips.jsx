import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Ticket,
  Download,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import api from "../services/api";
import "./MyTrips.css";

function MyTrips() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("bookings/");
      const data = response.data;

      setBookings(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("My trips error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load your bookings. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.booking_status === filter;
  });

  const downloadTicket = async (booking) => {
    setDownloadingId(booking.id);
    setError("");

    try {
      const response = await api.get(
        `bookings/${booking.id}/ticket/`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `AirBooking-${booking.booking_reference}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ticket download error:", err);

      setError(
        "Unable to download ticket. Confirm that the booking is paid and confirmed."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "confirmed") return <CheckCircle size={15} />;
    if (status === "cancelled") return <XCircle size={15} />;
    return <Clock size={15} />;
  };

  return (
    <div className="mytrips-page">

      <header className="mytrips-navbar">
        <div
          className="mytrips-logo"
          onClick={() => navigate("/")}
        >
          <Plane size={24} />
          <span>Air<span>Booking</span></span>
        </div>

        <div className="mytrips-nav">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/")}>
            Search Flights
          </button>
        </div>

        <button
          className="mytrips-account"
          onClick={() => navigate("/dashboard")}
        >
          My Account
        </button>
      </header>

      <main className="mytrips-container">

        <button
          className="mytrips-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <section className="mytrips-heading">
          <div>
            <span>YOUR TRAVEL HISTORY</span>
            <h1>My Trips</h1>
            <p>Manage your bookings and access your flight tickets.</p>
          </div>

          <button
            className="mytrips-refresh"
            onClick={fetchBookings}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </section>

        {/* Summary */}
        <section className="mytrips-stats">
          <div>
            <Ticket size={22} />
            <span>Total Bookings</span>
            <h2>{bookings.length}</h2>
          </div>

          <div>
            <CheckCircle size={22} />
            <span>Confirmed</span>
            <h2>
              {bookings.filter(
                (b) => b.booking_status === "confirmed"
              ).length}
            </h2>
          </div>

          <div>
            <Clock size={22} />
            <span>Pending</span>
            <h2>
              {bookings.filter(
                (b) => b.booking_status === "pending"
              ).length}
            </h2>
          </div>

          <div>
            <XCircle size={22} />
            <span>Cancelled</span>
            <h2>
              {bookings.filter(
                (b) => b.booking_status === "cancelled"
              ).length}
            </h2>
          </div>
        </section>

        {/* Filters */}
        <section className="mytrips-list-section">

          <div className="mytrips-list-heading">
            <div>
              <h2>Your Bookings</h2>
              <p>All your flight reservations in one place.</p>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading && (
            <div className="mytrips-message">
              <div className="mytrips-spinner"></div>
              <h3>Loading your trips...</h3>
            </div>
          )}

          {!loading && error && (
            <div className="mytrips-message mytrips-error">
              <AlertCircle size={30} />
              <h3>Unable to load bookings</h3>
              <p>{error}</p>

              <button onClick={fetchBookings}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="mytrips-message">
              <div className="mytrips-empty-icon">
                <Plane size={35} />
              </div>

              <h3>No bookings found</h3>

              <p>
                Your flight reservations will appear here once you book a flight.
              </p>

              <button onClick={() => navigate("/")}>
                Explore Flights
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredBookings.map((booking) => (
              <article className="trip-card" key={booking.id}>

                <div className="trip-card-header">
                  <div className="trip-reference">
                    <Ticket size={19} />
                    <div>
                      <span>BOOKING REFERENCE</span>
                      <strong>{booking.booking_reference}</strong>
                    </div>
                  </div>

                  <div
                    className={`trip-status ${booking.booking_status}`}
                  >
                    {getStatusIcon(booking.booking_status)}
                    {booking.booking_status}
                  </div>
                </div>

                <div className="trip-airline">
                  <div className="trip-airline-icon">
                    <Plane size={22} />
                  </div>

                  <div>
                    <h3>{booking.airline || "Airline"}</h3>
                    <p>{booking.flight_number || "Flight details"}</p>
                  </div>
                </div>

                <div className="trip-route">

                  <div>
                    <span>DEPARTURE</span>
                    <h2>{formatTime(booking.departure_time)}</h2>
                    <h4>{booking.departure_city}</h4>
                    <p>{formatDate(booking.departure_time)}</p>
                  </div>

                  <div className="trip-route-line">
                    <div></div>
                    <Plane size={19} />
                    <div></div>
                  </div>

                  <div className="trip-arrival">
                    <span>ARRIVAL</span>
                    <h2>{formatTime(booking.arrival_time)}</h2>
                    <h4>{booking.arrival_city}</h4>
                    <p>{formatDate(booking.arrival_time)}</p>
                  </div>

                </div>

                <div className="trip-card-footer">

                  <div className="trip-extra-info">
                    <div>
                      <UsersIcon />
                      <span>{booking.number_of_seats} Passenger(s)</span>
                    </div>

                    <div>
                      <MapPin size={15} />
                      <span>{booking.payment_status} payment</span>
                    </div>
                  </div>

                  <div className="trip-actions">
                    <strong>{formatPrice(booking.total_price)}</strong>

                    <button
                      onClick={() => downloadTicket(booking)}
                      disabled={
                        booking.booking_status !== "confirmed" ||
                        booking.payment_status !== "paid" ||
                        downloadingId === booking.id
                      }
                    >
                      {downloadingId === booking.id ? (
                        "Downloading..."
                      ) : (
                        <>
                          <Download size={16} />
                          E-Ticket
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </article>
            ))}

        </section>

      </main>

      <footer className="mytrips-footer">
        © 2026 AirBooking. All rights reserved.
      </footer>

    </div>
  );
}

function UsersIcon() {
  return <CalendarDays size={15} />;
}

export default MyTrips;