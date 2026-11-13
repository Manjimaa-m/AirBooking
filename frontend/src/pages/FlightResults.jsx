import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Plane,
  Clock,
  ArrowRight,
  CalendarDays,
  Users,
  Search,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import "./FlightResults.css";

function FlightResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const departureCity = searchParams.get("departure_city") || "";
  const arrivalCity = searchParams.get("arrival_city") || "";
  const departureDate = searchParams.get("departure_date") || "";
  const passengers = searchParams.get("passengers") || "1";

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("price");

  const fetchFlights = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("flights/search/", {
        params: {
          departure_city: departureCity,
          arrival_city: arrivalCity,
          departure_date: departureDate,
          passengers: passengers,
        },
      });

      const data = response.data;

      setFlights(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Flight search error:", err);
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
  }, [departureCity, arrivalCity, departureDate, passengers]);

  const sortedFlights = useMemo(() => {
    const result = [...flights];

    if (sortBy === "price") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "departure") {
      result.sort(
        (a, b) =>
          new Date(a.departure_time) - new Date(b.departure_time)
      );
    } else if (sortBy === "arrival") {
      result.sort(
        (a, b) => new Date(a.arrival_time) - new Date(b.arrival_time)
      );
    }

    return result;
  }, [flights, sortBy]);

  const formatTime = (dateTime) => {
    if (!dateTime) return "--:--";

    return new Date(dateTime).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return "";

    return new Date(dateTime).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  };

  const getDuration = (departure, arrival) => {
    if (!departure || !arrival) return "N/A";

    const difference =
      new Date(arrival).getTime() - new Date(departure).getTime();

    if (difference <= 0) return "N/A";

    const hours = Math.floor(difference / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      on_time: "On Time",
      delayed: "Delayed",
      cancelled: "Cancelled",
    };

    return labels[status] || status || "Unknown";
  };

  return (
    <div className="flight-results-page">

      {/* Navbar */}
      <nav className="results-navbar">
        <div
          className="results-logo"
          onClick={() => navigate("/")}
        >
          <Plane size={25} />
          <span>Air<span>Booking</span></span>
        </div>

        <div className="results-nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/my-trips")}>My Trips</button>
        </div>

        <button
          className="results-profile-btn"
          onClick={() =>
            navigate(
              localStorage.getItem("access_token")
                ? "/dashboard"
                : "/login"
            )
          }
        >
          My Account
        </button>
      </nav>

      {/* Search Summary */}
      <section className="results-search-summary">
        <div className="results-summary-heading">
          <div>
            <p className="results-eyebrow">YOUR JOURNEY STARTS HERE</p>
            <h1>Available Flights</h1>
            <p>Compare flights and find the best option for your journey.</p>
          </div>

          <button
            className="modify-search-btn"
            onClick={() => navigate("/")}
          >
            <Search size={17} />
            Modify Search
          </button>
        </div>

        <div className="journey-summary-card">
          <div className="journey-location">
            <span>FROM</span>
            <h2>{departureCity || "Any city"}</h2>
          </div>

          <div className="journey-arrow">
            <Plane size={22} />
            <div></div>
          </div>

          <div className="journey-location">
            <span>TO</span>
            <h2>{arrivalCity || "Any city"}</h2>
          </div>

          <div className="journey-divider"></div>

          <div className="journey-info">
            <CalendarDays size={18} />
            <div>
              <span>DEPARTURE</span>
              <strong>{departureDate || "Any date"}</strong>
            </div>
          </div>

          <div className="journey-info">
            <Users size={18} />
            <div>
              <span>PASSENGERS</span>
              <strong>
                {passengers} {Number(passengers) === 1 ? "Person" : "People"}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="results-main">

        <div className="results-toolbar">
          <div>
            <h2>Flight Options</h2>
            <p>
              {loading
                ? "Searching flights..."
                : `${flights.length} flight(s) found`}
            </p>
          </div>

          <div className="sort-container">
            <SlidersHorizontal size={17} />

            <label htmlFor="sortFlights">Sort by</label>

            <select
              id="sortFlights"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price">Lowest Price</option>
              <option value="departure">Departure Time</option>
              <option value="arrival">Arrival Time</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="results-message">
            <div className="loading-spinner"></div>
            <h3>Finding your flights...</h3>
            <p>Please wait while we search available flights.</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="results-message error-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>

            <button onClick={fetchFlights}>
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && flights.length === 0 && (
          <div className="results-message empty-message">
            <div className="empty-plane">
              <Plane size={35} />
            </div>

            <h3>No flights found</h3>

            <p>
              We couldn't find flights matching your search.
              Try another date or destination.
            </p>

            <button onClick={() => navigate("/")}>
              Search Again
            </button>
          </div>
        )}

        {/* Flight Cards */}
        {!loading &&
          !error &&
          sortedFlights.map((flight) => (
            <div className="flight-card" key={flight.id}>

              <div className="flight-card-top">
                <div className="airline-details">
                  <div className="airline-icon">
                    <Plane size={23} />
                  </div>

                  <div>
                    <h3>{flight.airline}</h3>
                    <p>{flight.flight_number}</p>
                  </div>
                </div>

                <span
                  className={`flight-status ${flight.status}`}
                >
                  {getStatusLabel(flight.status)}
                </span>
              </div>

              <div className="flight-card-middle">

                <div className="flight-time-block">
                  <h2>{formatTime(flight.departure_time)}</h2>
                  <h4>{flight.departure_airport}</h4>
                  <p>{flight.departure_city}</p>
                  <small>{formatDate(flight.departure_time)}</small>
                </div>

                <div className="flight-duration-block">
                  <span>
                    {getDuration(
                      flight.departure_time,
                      flight.arrival_time
                    )}
                  </span>

                  <div className="flight-line">
                    <div className="flight-line-dot"></div>
                    <div className="flight-line-middle">
                      <Plane size={17} />
                    </div>
                    <div className="flight-line-dot"></div>
                  </div>

                  <small>Non-stop</small>
                </div>

                <div className="flight-time-block arrival-block">
                  <h2>{formatTime(flight.arrival_time)}</h2>
                  <h4>{flight.arrival_airport}</h4>
                  <p>{flight.arrival_city}</p>
                  <small>{formatDate(flight.arrival_time)}</small>
                </div>

              </div>

              <div className="flight-card-bottom">
                <div className="flight-availability">
                  <Clock size={16} />
                  <span>
                    {flight.available_seats} seats available
                  </span>
                </div>

                <div className="flight-price-block">
                  <div>
                    <span>Starting from</span>
                    <h2>{formatPrice(flight.price)}</h2>
                    <small>per passenger</small>
                  </div>

                  <button
                    disabled={
                      flight.status === "cancelled" ||
                      Number(flight.available_seats) <
                        Number(passengers)
                    }
                    onClick={() =>
                      navigate(`/flights/${flight.id}`, {
                        state: { passengers },
                      })
                    }
                  >
                    Select Flight
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>

            </div>
          ))}
      </main>

      {/* Footer */}
      <footer className="results-footer">
        <div className="results-logo">
          <Plane size={22} />
          <span>Air<span>Booking</span></span>
        </div>

        <p>Making every journey simple and memorable.</p>
        <small>© 2026 AirBooking. All rights reserved.</small>
      </footer>

    </div>
  );
}

export default FlightResults;