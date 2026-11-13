import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Plane,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  Users,
} from "lucide-react";

import api from "../services/api";
import "./Booking.css";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passengers = Number(location.state?.passengers || 1);

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await api.get(`flights/${id}/`);
        setFlight(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Unable to load flight details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

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

  const totalPrice = Number(flight?.price || 0) * passengers;

  // Create Booking
  const createBooking = async () => {
    setError("");

    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }

    if (!flight || flight.status === "cancelled") {
      setError("This flight is not available for booking.");
      return;
    }

    if (passengers > Number(flight.available_seats)) {
      setError("Not enough seats available.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await api.post("bookings/", {
        flight: Number(id),
        number_of_seats: passengers,
      });

      setBooking(response.data);
    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      setError(
        data?.detail ||
          data?.non_field_errors?.[0] ||
          data?.number_of_seats?.[0] ||
          data?.flight?.[0] ||
          "Booking failed. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Simulated Payment
  const makePayment = async () => {
    if (!booking?.id) return;

    setError("");
    setPaymentLoading(true);

    try {
      await api.post(`bookings/${booking.id}/payment/`);

      setPaymentSuccess(true);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Payment failed. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-message">
        <Loader2 className="booking-spinner" size={35} />
        <h3>Loading booking details...</h3>
      </div>
    );
  }

  if (error && !flight) {
    return (
      <div className="booking-message">
        <AlertCircle size={40} />
        <h3>Unable to load flight</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/flights")}>
          Back to Flights
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="booking-success-page">
        <div className="booking-success-card">
          <div className="booking-success-icon">
            <CheckCircle size={55} />
          </div>

          <span className="booking-eyebrow">PAYMENT COMPLETED</span>

          <h1>Your Booking is Confirmed!</h1>

          <p>
            Your simulated payment was successful. Your flight booking
            has been confirmed.
          </p>

          <div className="success-reference">
            <span>BOOKING REFERENCE</span>
            <strong>{booking.booking_reference}</strong>
          </div>

          <div className="success-details">
            <div>
              <span>Flight</span>
              <strong>{flight.flight_number}</strong>
            </div>

            <div>
              <span>Passengers</span>
              <strong>{passengers}</strong>
            </div>

            <div>
              <span>Amount Paid</span>
              <strong>{formatPrice(booking.total_price)}</strong>
            </div>
          </div>

          <button
            className="success-primary-btn"
            onClick={() => navigate("/my-trips")}
          >
            View My Trips
            <ArrowRight size={18} />
          </button>

          <button
            className="success-secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">

      {/* Navbar */}
      <header className="booking-navbar">
        <div
          className="booking-logo"
          onClick={() => navigate("/")}
        >
          <Plane size={24} />
          <span>Air<span>Booking</span></span>
        </div>

        <button
          className="booking-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>
      </header>

      <main className="booking-container">

        <div className="booking-heading">
          <span className="booking-eyebrow">COMPLETE YOUR JOURNEY</span>
          <h1>Review & Confirm Booking</h1>
          <p>Review your flight information and complete your booking.</p>
        </div>

        {/* Progress */}
        <div className="booking-progress">
          <div className="progress-step active">
            <span>1</span>
            <p>Flight Details</p>
          </div>

          <div className="progress-line"></div>

          <div className={`progress-step ${booking ? "active" : ""}`}>
            <span>2</span>
            <p>Booking</p>
          </div>

          <div className="progress-line"></div>

          <div className="progress-step">
            <span>3</span>
            <p>Confirmation</p>
          </div>
        </div>

        <div className="booking-layout">

          {/* Left */}
          <section className="booking-left">

            <div className="booking-flight-card">
              <div className="booking-card-title">
                <h2>Flight Information</h2>
                <span className="booking-status">Selected Flight</span>
              </div>

              <div className="booking-airline">
                <div className="booking-airline-icon">
                  <Plane size={23} />
                </div>

                <div>
                  <h3>{flight.airline}</h3>
                  <p>{flight.flight_number}</p>
                </div>
              </div>

              <div className="booking-route">
                <div>
                  <span>FROM</span>
                  <h2>{flight.departure_airport}</h2>
                  <p>{flight.departure_city}</p>
                  <small>{formatDateTime(flight.departure_time)}</small>
                </div>

                <div className="booking-route-arrow">
                  <Plane size={22} />
                  <div></div>
                </div>

                <div>
                  <span>TO</span>
                  <h2>{flight.arrival_airport}</h2>
                  <p>{flight.arrival_city}</p>
                  <small>{formatDateTime(flight.arrival_time)}</small>
                </div>
              </div>

              <div className="booking-flight-meta">
                <div>
                  <CalendarDays size={17} />
                  Flight Date
                </div>

                <div>
                  <Users size={17} />
                  {passengers} Passenger(s)
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="booking-information-card">
              <h2>Passenger Summary</h2>

              <div className="booking-info-row">
                <span>Number of passengers</span>
                <strong>{passengers}</strong>
              </div>

              <div className="booking-info-row">
                <span>Available seats before booking</span>
                <strong>{flight.available_seats}</strong>
              </div>

              <div className="booking-info-row">
                <span>Booking status</span>
                <strong>{booking ? "Created" : "Not created"}</strong>
              </div>
            </div>

          </section>

          {/* Right */}
          <aside className="booking-right">

            <div className="booking-price-card">
              <h2>Price Summary</h2>

              <div className="booking-price-row">
                <span>Price per passenger</span>
                <strong>{formatPrice(flight.price)}</strong>
              </div>

              <div className="booking-price-row">
                <span>Passengers</span>
                <strong>× {passengers}</strong>
              </div>

              <div className="booking-price-total">
                <span>Total Amount</span>
                <h2>{formatPrice(booking?.total_price || totalPrice)}</h2>
              </div>

              {!booking ? (
                <>
                  <p className="booking-note">
                    Your seats will be reserved when you create the booking.
                  </p>

                  <button
                    className="booking-main-btn"
                    onClick={createBooking}
                    disabled={
                      bookingLoading ||
                      flight.status === "cancelled" ||
                      passengers > Number(flight.available_seats)
                    }
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="booking-spinner" size={18} />
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="booking-created-message">
                    <CheckCircle size={19} />
                    <span>Booking created successfully</span>
                  </div>

                  <div className="booking-reference-box">
                    <span>BOOKING REFERENCE</span>
                    <strong>{booking.booking_reference}</strong>
                  </div>

                  <div className="payment-method">
                    <CreditCard size={20} />
                    <div>
                      <strong>Demo Payment</strong>
                      <small>Simulated payment gateway</small>
                    </div>
                  </div>

                  <button
                    className="booking-main-btn"
                    onClick={makePayment}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="booking-spinner" size={18} />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay {formatPrice(booking.total_price)}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </>
              )}

              {error && (
                <div className="booking-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}

              <div className="booking-secure">
                <ShieldCheck size={18} />
                <span>Secure booking process</span>
              </div>

            </div>

          </aside>

        </div>

      </main>

      <footer className="booking-footer">
        © 2026 AirBooking. All rights reserved.
      </footer>

    </div>
  );
}

export default Booking;