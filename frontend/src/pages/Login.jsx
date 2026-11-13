import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane, Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      const response = await api.post("auth/login/", formData);

      const userData = response.data.user;

      login(userData, response.data);

      if (userData?.is_staff || userData?.is_superuser) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response?.data;

      if (typeof message === "string") {
        setError(message);
      } else if (message?.detail) {
        setError(message.detail);
      } else if (message?.non_field_errors) {
        setError(message.non_field_errors[0]);
      } else {
        setError("Login failed. Please check your details.");
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
          <span>YOUR JOURNEY BEGINS HERE</span>
          <h1>Discover the world with confidence.</h1>
          <p>Every great journey starts with a single booking.</p>
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
            <span>WELCOME BACK</span>
            <h2>Sign in to AirBooking</h2>
            <p>Enter your details to access your account.</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="auth-input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={19} />}
            </button>

          </form>

          <div className="auth-switch">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;