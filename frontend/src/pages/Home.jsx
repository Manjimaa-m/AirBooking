import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./Home.css";

import {
  Plane,
  ArrowRight,
  MapPin,
  CalendarDays,
  Users,
  ArrowLeftRight,
  ShieldCheck,
  Headset,
  BadgeCheck,
  TicketCheck,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [tripType, setTripType] = useState("round_trip");
  const [searchError, setSearchError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  // SWAP CITIES
  const handleSwap = () => {
    setDepartureCity(arrivalCity);
    setArrivalCity(departureCity);
  };

  // SEARCH FLIGHTS
  const handleSearch = (e) => {
    e.preventDefault();

    setSearchError("");

    if (!departureCity.trim() || !arrivalCity.trim()) {
      setSearchError("Please enter departure and arrival cities.");
      return;
    }

    if (
      departureCity.trim().toLowerCase() ===
      arrivalCity.trim().toLowerCase()
    ) {
      setSearchError("Departure and arrival cities cannot be the same.");
      return;
    }

    if (!departureDate) {
      setSearchError("Please select your departure date.");
      return;
    }

    if (departureDate < today) {
      setSearchError("Please select a future travel date.");
      return;
    }

    const params = new URLSearchParams({
      departure_city: departureCity.trim(),
      arrival_city: arrivalCity.trim(),
      departure_date: departureDate,
      passengers: passengers,
      trip_type: tripType,
    });

    navigate(`/flights?${params.toString()}`);
  };

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero">

        {/* NAVBAR */}
        <nav className="navbar">

          <Link to="/" className="logo">
            <Plane size={30} />
            <span>AirBooking</span>
          </Link>

          <div className="nav-links">
            <Link to="/">Flights</Link>
            <Link to="/my-trips">My Trips</Link>
            <Link to="/manage-booking">Manage Booking</Link>
          </div>

          <div className="nav-actions">

            <Link to="/login" className="signin-btn">
              Sign In
            </Link>

            <Link to="/register" className="signup-btn">
              Get Started
            </Link>

          </div>

        </nav>

        {/* HERO CONTENT */}
        <div className="hero-content">

          <p className="hero-subtitle">
            ✈ YOUR JOURNEY BEGINS HERE ✈
          </p>

          <h1>AirBooking</h1>

          <p className="hero-description">
            Discover the world. Travel beyond boundaries.
          </p>

        </div>

      </section>

      {/* FLIGHT SEARCH SECTION */}
      <section className="search-section">

        <form className="search-card" onSubmit={handleSearch}>

          <div className="search-header">

            <div className="active-tab">
              <Plane size={21} />
              <span>Flights</span>
            </div>

            <select
              className="trip-type"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="round_trip">Round Trip</option>
              <option value="one_way">One Way</option>
            </select>

          </div>

          <div className="search-fields">

            {/* DEPARTURE */}
            <div className="search-field">

              <label>From</label>

              <div className="field-value">

                <MapPin size={19} />

                <input
                  type="text"
                  placeholder="Departure city"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                />

              </div>

              <small>Departure City</small>

            </div>

            {/* SWAP */}
            <button
              type="button"
              className="swap-btn"
              onClick={handleSwap}
              aria-label="Swap departure and arrival cities"
            >
              <ArrowLeftRight size={20} />
            </button>

            {/* ARRIVAL */}
            <div className="search-field">

              <label>To</label>

              <div className="field-value">

                <MapPin size={19} />

                <input
                  type="text"
                  placeholder="Arrival city"
                  value={arrivalCity}
                  onChange={(e) => setArrivalCity(e.target.value)}
                />

              </div>

              <small>Destination City</small>

            </div>

            {/* DATE */}
            <div className="search-field">

              <label>Departure</label>

              <div className="field-value">

                <CalendarDays size={19} />

                <input
                  type="date"
                  min={today}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />

              </div>

              <small>Select travel date</small>

            </div>

            {/* PASSENGERS */}
            <div className="search-field travelers-field">

              <label>Travelers</label>

              <div className="field-value">

                <Users size={19} />

                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                  <option value="5">5 Passengers</option>
                </select>

              </div>

              <small>Economy</small>

            </div>

            {/* SEARCH BUTTON */}
            <button type="submit" className="search-btn">
              Search Flights
              <ArrowRight size={19} />
            </button>

          </div>

          {searchError && (
            <p className="search-error">
              {searchError}
            </p>
          )}

        </form>

      </section>

      {/* BENEFITS */}
      <section className="benefits">

        <div className="benefit-item">
          <div className="benefit-icon">
            <BadgeCheck />
          </div>

          <div>
            <h4>Best Price Guarantee</h4>
            <p>Find the best flight deals</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-icon">
            <Headset />
          </div>

          <div>
            <h4>24/7 Customer Support</h4>
            <p>We're here to help</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-icon">
            <ShieldCheck />
          </div>

          <div>
            <h4>Secure Booking</h4>
            <p>Your data is protected</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-icon">
            <TicketCheck />
          </div>

          <div>
            <h4>Easy Booking</h4>
            <p>Travel with confidence</p>
          </div>
        </div>

      </section>

      {/* DESTINATIONS */}
      <section className="destinations">

        <div className="destination-card dubai">

          <span className="destination-tag">
            Popular Destination
          </span>

          <h2>Dubai</h2>
          <p>United Arab Emirates</p>

          <div className="destination-price">
            <small>Explore flights to</small>
            <h3>Dubai</h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setArrivalCity("Dubai");
              window.scrollTo({ top: 450, behavior: "smooth" });
            }}
          >
            Explore Flights →
          </button>

        </div>

        <div className="destination-card tokyo">

          <span className="destination-tag">
            Discover Asia
          </span>

          <h2>Tokyo</h2>
          <p>Japan</p>

          <div className="destination-price">
            <small>Explore flights to</small>
            <h3>Tokyo</h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setArrivalCity("Tokyo");
              window.scrollTo({ top: 450, behavior: "smooth" });
            }}
          >
            Explore Flights →
          </button>

        </div>

        <div className="offer-card">

          <span>EXCLUSIVE OFFERS</span>

          <h2>
            Your Next Journey
            <br />
            Starts Here.
          </h2>

          <p>
            Discover new destinations and make
            unforgettable memories.
          </p>

          <Link to="/register">
            Join AirBooking <ArrowRight size={17} />
          </Link>

        </div>

      </section>

      {/* AIRLINE PARTNERS */}
      <section className="airline-partners">

        <span>Our Airline Partners</span>

        <div className="airline-list">
          <h3>Emirates</h3>
          <h3>QATAR</h3>
          <h3>Lufthansa</h3>
          <h3>AIR FRANCE</h3>
          <h3>DELTA</h3>
          <h3>Turkish Airlines</h3>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-logo">
          <Plane size={23} />
          AirBooking
        </div>

        <p>
          Your journey begins with us. Travel smarter,
          safer and better.
        </p>

        <small>
          © 2026 AirBooking. All rights reserved.
        </small>

      </footer>

    </div>
  );
}

export default Home;