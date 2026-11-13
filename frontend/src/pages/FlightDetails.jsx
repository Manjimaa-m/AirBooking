import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Plane,
  ArrowLeft,
  ArrowRight,
  Clock,
  CalendarDays,
  Users,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";
import "./FlightDetails.css";

function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passengers, setPassengers] = useState(
    Number(location.state?.passengers || 1)
  );

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`flights/${id}/`);
        setFlight(response.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail || "Unable to load flight details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const formatDateTime = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const totalPrice = Number(flight?.price || 0) * passengers;

  const continueBooking = () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login", {
        state: {
          from: `/flights/${id}`,
          passengers,
        },
      });
      return;
    }

    navigate(`/booking/${id}`, {
      state: { passengers },
    });
  };

  if (loading) {
    return (
      <div className="flight-details-message">
        <div className="details-spinner"></div>
        <h3>Loading flight details...</h3>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="flight-details-message">
        <AlertCircle size={40} />
        <h3>Flight not available</h3>
        <p>{error || "Flight details could not be found."}</p>
        <button onClick={() => navigate("/flights")}>
          Back to Flights
        </button>
      </div>
    );
  }

  const isCancelled = flight.status === "cancelled";
  const insufficientSeats =
    passengers > Number(flight.available_seats);

  return (
    <div className="flight-details-page">

      <header className="details-navbar">
        <div className="details-brand" onClick={() => navigate("/")}>
          <Plane size={25} />
          <span>Air<span>Booking</span></span>
        </div>

        <button
          className="details-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>
      </header>

      <main className="details-container">

        <button
          className="details-back-link"
          onClick={() => navigate("/flights")}
        >
          <ArrowLeft size={16} />
          Back to flight results
        </button>

        <div className="details-heading">
          <div>
            <span className="details-eyebrow">FLIGHT INFORMATION</span>
            <h1>Review Your Flight</h1>
            <p>Check your journey details before proceeding.</p>
          </div>

          <span className={`details-status ${flight.status}`}>
            {flight.status === "on_time"
              ? "On Time"
              : flight.status === "delayed"
              ? "Delayed"
              : "Cancelled"}
          </span>
        </div>

        {/* Flight Information */}
        <section className="details-flight-card">

          <div className="details-airline">
            <div className="details-airline-icon">
              <Plane size={25} />
            </div>

            <div>
              <h3>{flight.airline}</h3>
              <p>Flight {flight.flight_number}</p>
            </div>
          </div>

          <div className="details-route">

            <div>
              <span>DEPARTURE</span>
              <h2>{flight.departure_airport}</h2>
              <h4>{flight.departure_city}</h4>
              <p>{formatDateTime(flight.departure_time)}</p>
            </div>

            <div className="details-route-line">
              <Clock size={18} />
              <div></div>
              <Plane size={21} />
              <div></div>
              <CheckCircle size={17} />
              <small>Flight Journey</small>
            </div>

            <div className="details-arrival">
              <span>ARRIVAL</span>
              <h2>{flight.arrival_airport}</h2>
              <h4>{flight.arrival_city}</h4>
              <p>{formatDateTime(flight.arrival_time)}</p>
            </div>

          </div>

          <div className="details-flight-meta">
            <div>
              <CalendarDays size={18} />
              <span>
                Departure: {formatDateTime(flight.departure_time)}
              </span>
            </div>

            <div>
              <Users size={18} />
              <span>
                {flight.available_seats} seats available
              </span>
            </div>
          </div>

        </section>

        {/* Passenger Selection */}
        <section className="details-passenger-card">
          <div className="details-section-title">
            <div>
              <span className="details-eyebrow">YOUR BOOKING</span>
              <h2>Select Passengers</h2>
              <p>Choose the number of passengers travelling.</p>
            </div>

            <Users size={25} />
          </div>

          <div className="passenger-selector">
            <div>
              <h3>Adult Passengers</h3>
              <p>Age 12 years and above</p>
            </div>

            <div className="passenger-counter">
              <button
                onClick={() =>
                  setPassengers((value) => Math.max(1, value - 1))
                }
                disabled={passengers <= 1}
              >
                −
              </button>

              <strong>{passengers}</strong>

              <button
                onClick={() =>
                  setPassengers((value) => Math.min(9, value + 1))
                }
                disabled={
                  passengers >= 9 ||
                  passengers >= Number(flight.available_seats)
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="details-price-summary">
            <div>
              <span>Price per passenger</span>
              <strong>{formatPrice(flight.price)}</strong>
            </div>

            <div>
              <span>Passengers</span>
              <strong>{passengers}</strong>
            </div>

            <div className="details-total">
              <span>Total Amount</span>
              <h2>{formatPrice(totalPrice)}</h2>
            </div>
          </div>

          <div className="details-secure-note">
            <ShieldCheck size={19} />
            <span>
              Your booking will be securely processed through AirBooking.
            </span>
          </div>

          {isCancelled && (
            <p className="details-warning">
              This flight has been cancelled and cannot be booked.
            </p>
          )}

          {insufficientSeats && (
            <p className="details-warning">
              Not enough seats available for your selection.
            </p>
          )}

          <button
            className="continue-booking-btn"
            onClick={continueBooking}
            disabled={isCancelled || insufficientSeats}
          >
            Continue to Booking
            <ArrowRight size={18} />
          </button>

        </section>

      </main>

      <footer className="details-footer">
        © 2026 AirBooking. All rights reserved.
      </footer>

    </div>
  );
}

export default FlightDetails;