import { useEffect, useState } from "react";
import {
  Plane,
  RefreshCw,
  MapPin,
  Clock,
  Users,
  IndianRupee,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import "./ManageFlights.css";

function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("flights/admin/");

      setFlights(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load flights. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const updateFlightStatus = async (flightId, newStatus) => {
    try {
      setUpdatingId(flightId);
      setError("");
      setMessage("");

      const response = await api.put(
        `flights/admin/${flightId}/status/`,
        { status: newStatus }
      );

      setFlights((previousFlights) =>
        previousFlights.map((flight) =>
          flight.id === flightId
            ? { ...flight, status: response.data.status }
            : flight
        )
      );

      setMessage(
        `${response.data.flight_number} status updated successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Unable to update flight status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      on_time: "On Time",
      delayed: "Delayed",
      cancelled: "Cancelled",
    };

    return labels[status] || status;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";

    return new Date(dateTime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  return (
    <div className="manage-flights-page">

      {/* Header */}
      <div className="manage-flights-header">
        <div>
          <span className="manage-flights-label">
            FLIGHT MANAGEMENT
          </span>

          <h1>Manage Flights</h1>

          <p>
            Monitor flight schedules, availability and operational status.
          </p>
        </div>

        <button
          className="manage-flight-refresh"
          onClick={fetchFlights}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="flight-summary-grid">

        <div className="flight-summary-card">
          <div className="flight-summary-icon blue">
            <Plane size={23} />
          </div>

          <div>
            <span>Total Flights</span>
            <h2>{flights.length}</h2>
          </div>
        </div>

        <div className="flight-summary-card">
          <div className="flight-summary-icon green">
            <Clock size={23} />
          </div>

          <div>
            <span>On Time</span>
            <h2>
              {flights.filter((f) => f.status === "on_time").length}
            </h2>
          </div>
        </div>

        <div className="flight-summary-card">
          <div className="flight-summary-icon orange">
            <AlertCircle size={23} />
          </div>

          <div>
            <span>Delayed</span>
            <h2>
              {flights.filter((f) => f.status === "delayed").length}
            </h2>
          </div>
        </div>

        <div className="flight-summary-card">
          <div className="flight-summary-icon red">
            <AlertCircle size={23} />
          </div>

          <div>
            <span>Cancelled</span>
            <h2>
              {flights.filter((f) => f.status === "cancelled").length}
            </h2>
          </div>
        </div>

      </div>

      {/* Messages */}
      {message && (
        <div className="flight-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="flight-error-message">
          {error}
        </div>
      )}

      {/* Flight List */}
      <div className="flight-list-card">

        <div className="flight-list-heading">
          <div>
            <h3>All Flights</h3>
            <p>View and update flight operational status.</p>
          </div>

          <span className="flight-total-badge">
            {flights.length} Flights
          </span>
        </div>

        {loading ? (
          <div className="flight-loading">
            <div className="flight-spinner"></div>
            <p>Loading flights...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="flight-empty">
            <Plane size={35} />
            <h3>No flights available</h3>
            <p>There are currently no flights in the system.</p>
          </div>
        ) : (
          <div className="flight-table-wrapper">

            <table className="manage-flight-table">

              <thead>
                <tr>
                  <th>FLIGHT</th>
                  <th>ROUTE</th>
                  <th>DEPARTURE</th>
                  <th>ARRIVAL</th>
                  <th>PRICE</th>
                  <th>SEATS</th>
                  <th>STATUS</th>
                  <th>UPDATE STATUS</th>
                </tr>
              </thead>

              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>

                    <td>
                      <div className="flight-number-info">
                        <div className="flight-table-icon">
                          <Plane size={17} />
                        </div>

                        <div>
                          <strong>{flight.flight_number}</strong>
                          <span>{flight.airline}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="flight-route-info">
                        <strong>{flight.departure_airport}</strong>
                        <span>to</span>
                        <strong>{flight.arrival_airport}</strong>
                      </div>

                      <div className="flight-city-info">
                        {flight.departure_city} → {flight.arrival_city}
                      </div>
                    </td>

                    <td>
                      <div className="flight-date-info">
                        <CalendarDays size={14} />
                        {formatDateTime(flight.departure_time)}
                      </div>
                    </td>

                    <td>
                      <div className="flight-date-info">
                        <CalendarDays size={14} />
                        {formatDateTime(flight.arrival_time)}
                      </div>
                    </td>

                    <td>
                      <div className="flight-price-info">
                        <IndianRupee size={14} />
                        {formatPrice(flight.price)}
                      </div>
                    </td>

                    <td>
                      <div className="flight-seat-info">
                        <Users size={14} />
                        {flight.available_seats}/{flight.total_seats}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`flight-status-badge ${flight.status}`}
                      >
                        {getStatusLabel(flight.status)}
                      </span>
                    </td>

                    <td>
                      <select
                        className="flight-status-select"
                        value={flight.status}
                        disabled={updatingId !== null}
                        onChange={(e) =>
                          updateFlightStatus(
                            flight.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="on_time">On Time</option>
                        <option value="delayed">Delayed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {updatingId === flight.id && (
                        <small className="flight-updating">
                          Updating...
                        </small>
                      )}
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

export default ManageFlights;