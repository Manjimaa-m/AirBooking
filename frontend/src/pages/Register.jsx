import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane, ArrowRight } from "lucide-react";
import api from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("auth/register/", formData);

      setSuccess(
        "Registration successful! Your account is pending admin approval."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const firstError = Object.values(data).flat()[0];
        setError(firstError || "Registration failed.");
      } else {
        setError("Registration failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          <Plane size={30} />
          AirBooking
        </Link>

        <div className="auth-brand-content">
          <span>START YOUR JOURNEY</span>
          <h1>The world is waiting for you.</h1>
          <p>Create your account and explore new destinations.</p>
        </div>

        <div className="auth-brand-footer">
          Premium travel. Seamless journeys.
        </div>
      </div>

      <div className="auth-form-section">

        <div className="auth-form-container">

          <Link to="/" className="auth-back">
            ← Back to Home
          </Link>

          <div className="auth-heading">
            <span>JOIN AIRBOOKING</span>
            <h2>Create your account</h2>
            <p>Fill in your details to get started.</p>
          </div>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          {success && (
            <div className="auth-success">{success}</div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="auth-name-row">

              <div className="auth-input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="auth-input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="auth-switch">
            Already have an account?
            <Link to="/login"> Sign In</Link>
          </div>

          <p className="approval-note">
            Your account will be activated after admin approval.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;