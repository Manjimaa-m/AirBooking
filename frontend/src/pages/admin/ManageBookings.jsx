import { useEffect, useMemo, useState } from "react";
import {
  Ticket,
  Search,
  RefreshCw,
  Plane,
  CalendarDays,
  Users,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
} from "lucide-react";

import api from "../../services/api";
import "./ManageBookings.css";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const [bookingResponse, statsResponse] = await Promise.all([
        api.get("bookings/admin/all/"),
        api.get("bookings/admin/stats/"),
      ]);

      setBookings(
        Array.isArray(bookingResponse.data)
          ? bookingResponse.data
          : bookingResponse.data.results || []
      );

      setStats(statsResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load booking information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const matchesSearch = [
        booking.booking_reference,
        booking.flight_number,
        booking.airline,
        booking.departure_city,
        booking.arrival_city,
        booking.username,
        booking.passenger_name,
        booking.user_email,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesBookingStatus =
        bookingFilter === "all" ||
        booking.booking_status === bookingFilter;

      const matchesPaymentStatus =
        paymentFilter === "all" ||
        booking.payment_status === paymentFilter;

      return (
        matchesSearch &&
        matchesBookingStatus &&
        matchesPaymentStatus
      );
    });
  }, [bookings, search, bookingFilter, paymentFilter]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const getBookingStatus = (status) => {
    const labels = {
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
    };

    return labels[status] || status || "Unknown";
  };

  const getPaymentStatus = (status) => {
    const labels = {
      paid: "Paid",
      pending: "Pending",
      failed: "Failed",
    };

    return labels[status] || status || "Unknown";
  };

  return (
    <div className="manage-bookings-page">

      {/* Header */}
      <div className="manage-bookings-header">
        <div>
          <span className="manage-bookings-label">
            BOOKING MANAGEMENT
          </span>

          <h1>All Bookings</h1>

          <p>
            Monitor and review all customer flight reservations.
          </p>
        </div>

        <button
          className="booking-refresh-btn"
          onClick={fetchBookings}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="booking-stats-grid">

        <div className="booking-stat-card">
          <div className="booking-stat-icon blue">
            <Ticket size={22} />
          </div>

          <div>
            <span>Total Bookings</span>
            <h2>{stats?.total_bookings ?? 0}</h2>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon green">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Confirmed</span>
            <h2>{stats?.confirmed_bookings ?? 0}</h2>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon orange">
            <Clock size={22} />
          </div>

          <div>
            <span>Pending</span>
            <h2>{stats?.pending_bookings ?? 0}</h2>
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-icon red">
            <XCircle size={22} />
          </div>

          <div>
            <span>Cancelled</span>
            <h2>{stats?.cancelled_bookings ?? 0}</h2>
          </div>
        </div>

      </div>

      {/* Revenue */}
      <div className="booking-revenue-card">
        <div className="booking-revenue-icon">
          <IndianRupee size={23} />
        </div>

        <div>
          <span>Total Paid Revenue</span>

          <h2>
            ₹{formatPrice(stats?.total_revenue)}
          </h2>

          <p>
            Total revenue from paid bookings, as reported by the API.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="booking-error-message">
          {error}
        </div>
      )}

      {/* Booking Table */}
      <div className="booking-list-card">

        <div className="booking-list-heading">
          <div>
            <h3>Booking Records</h3>
            <p>View and search customer reservations.</p>
          </div>

          <span className="booking-count-badge">
            {filteredBookings.length} Records
          </span>
        </div>

        {/* Search and Filters */}
        <div className="booking-filter-bar">

          <div className="booking-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search reference, flight or route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
          >
            <option value="all">All Booking Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

        </div>

        {/* Table */}
        {loading ? (
          <div className="booking-loading">
            <div className="booking-spinner"></div>
            <p>Loading booking records...</p>
          </div>
        ) : error ? (
          <div className="booking-empty">
            <Ticket size={35} />
            <h3>Unable to display bookings</h3>
            <p>Please check the API connection and try again.</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="booking-empty">
            <Ticket size={35} />
            <h3>No bookings found</h3>
            <p>Try changing your search or filter options.</p>
          </div>
        ) : (
          <div className="booking-table-wrapper">

            <table className="manage-booking-table">

              <thead>
                <tr>
                  <th>BOOKING REFERENCE</th>
                  <th>FLIGHT DETAILS</th>
                  <th>ROUTE</th>
                  <th>BOOKING DATE</th>
                  <th>SEATS</th>
                  <th>AMOUNT</th>
                  <th>BOOKING STATUS</th>
                  <th>PAYMENT</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>

                    <td>
                      <div className="booking-reference-info">
                        <div className="booking-ticket-icon">
                          <Ticket size={17} />
                        </div>

                        <div>
                          <strong>
                            {booking.booking_reference}
                          </strong>

                          <span>
                            Booking #{booking.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="booking-flight-info">
                        <strong>
                          {booking.flight_number || "N/A"}
                        </strong>

                        <span>
                          {booking.airline || "Airline unavailable"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="booking-route-info">
                        <Plane size={15} />

                        <span>
                          {booking.departure_city || "N/A"}
                          {" → "}
                          {booking.arrival_city || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="booking-date-info">
                        <CalendarDays size={14} />
                        {formatDate(booking.created_at)}
                      </div>
                    </td>

                    <td>
                      <div className="booking-seat-info">
                        <Users size={14} />
                        {booking.number_of_seats}
                      </div>
                    </td>

                    <td>
                      <div className="booking-price-info">
                        ₹{formatPrice(booking.total_price)}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`booking-status-badge ${booking.booking_status}`}
                      >
                        {getBookingStatus(booking.booking_status)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`payment-status-badge ${booking.payment_status}`}
                      >
                        <CreditCard size={13} />
                        {getPaymentStatus(booking.payment_status)}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default ManageBookings;