import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  LayoutDashboard,
  Users,
  Ticket,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  Menu,
  X,
  CalendarDays,
  AlertCircle,
  Settings,
  Radio,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("bookings/admin/stats/");
      setStats(response.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const statCards = [
    {
      title: "Total Bookings",
      value: stats?.total_bookings ?? 0,
      icon: <Ticket />,
      color: "blue",
      description: "All reservations",
    },
    {
      title: "Confirmed Bookings",
      value: stats?.confirmed_bookings ?? 0,
      icon: <CheckCircle />,
      color: "green",
      description: "Successfully confirmed",
    },
    {
      title: "Pending Bookings",
      value: stats?.pending_bookings ?? 0,
      icon: <Clock />,
      color: "orange",
      description: "Awaiting payment",
    },
    {
      title: "Cancelled Bookings",
      value: stats?.cancelled_bookings ?? 0,
      icon: <XCircle />,
      color: "purple",
      description: "Cancelled reservations",
    },
  ];

  const managementItems = [
    {
      title: "User Approvals",
      description: "Review pending registration requests.",
      icon: <Users size={22} />,
      button: "Manage Users",
      path: "/admin/users",
      color: "orange",
    },
    {
      title: "Flight Management",
      description: "View flights and manage flight status.",
      icon: <Plane size={22} />,
      button: "Manage Flights",
      path: "/admin/flights",
      color: "blue",
    },
    {
      title: "Live Flight Status",
      description: "Monitor real-time aircraft information.",
      icon: <Radio size={22} />,
      button: "View Live Flights",
      path: "/admin/live-flights",
      color: "green",
    },
  ];

  return (
    <div className="admin-layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Plane size={23} />
          </div>

          <span>
            Air<span>Booking</span>
          </span>

          <button
            className="admin-close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>

          <div>
            <h4>Administrator</h4>
            <span>Management Portal</span>
          </div>
        </div>

        <p className="admin-menu-label">MAIN MENU</p>

        <nav className="admin-menu">

          <button className="active">
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/users")}>
            <Users size={19} />
            User Approvals
          </button>

          <button onClick={() => navigate("/admin/flights")}>
            <Plane size={19} />
            Manage Flights
          </button>

          <button onClick={() => navigate("/admin/bookings")}>
            <Ticket size={19} />
            Bookings
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <button onClick={() => navigate("/")}>
            <ArrowUpRight size={18} />
            View Website
          </button>

          <button onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="admin-main">

        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <span>ADMINISTRATION</span>
              <h2>Dashboard Overview</h2>
            </div>

          </div>

          <div className="admin-topbar-right">

            <button
              className="admin-refresh"
              onClick={fetchStats}
              disabled={loading}
            >
              <RefreshCw
                size={17}
                className={loading ? "admin-rotating" : ""}
              />
              Refresh
            </button>

            <div className="admin-user-icon">A</div>

          </div>

        </header>

        <div className="admin-content">

          {/* Welcome */}
          <section className="admin-welcome">

            <div>
              <span>WELCOME BACK</span>
              <h1>Good to see you, Admin!</h1>
              <p>
                Here's what's happening with your AirBooking platform.
              </p>
            </div>

            <div className="admin-welcome-icon">
              <Plane size={54} />
            </div>

          </section>

          {/* Error */}
          {error && (
            <div className="admin-error">
              <AlertCircle size={19} />

              <div>
                <strong>Unable to load statistics</strong>
                <p>{error}</p>
              </div>

              <button onClick={fetchStats}>Retry</button>
            </div>
          )}

          {/* Statistics */}
          <section className="admin-section">

            <div className="admin-section-heading">
              <div>
                <h2>Platform Statistics</h2>
                <p>Overview of your booking platform.</p>
              </div>

              <span>
                <CalendarDays size={15} />
                Live data
              </span>
            </div>

            <div className="admin-stats-grid">

              {statCards.map((card) => (
                <div className="admin-stat-card" key={card.title}>

                  <div className={`admin-stat-icon ${card.color}`}>
                    {card.icon}
                  </div>

                  <div className="admin-stat-info">
                    <span>{card.title}</span>

                    <h3>
                      {loading ? "..." : card.value}
                    </h3>

                    <p>{card.description}</p>
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* Booking Overview */}
          <section className="admin-section">

            <div className="admin-section-heading">
              <div>
                <h2>Booking Overview</h2>
                <p>Current booking performance.</p>
              </div>
            </div>

            <div className="admin-overview-grid">

              <div className="admin-overview-card">

                <div className="overview-card-heading">
                  <div className="overview-icon confirmed">
                    <CheckCircle size={21} />
                  </div>

                  <span>Confirmed Bookings</span>
                </div>

                <h2>
                  {loading ? "..." : stats?.confirmed_bookings ?? 0}
                </h2>

                <p>Successfully confirmed reservations</p>

              </div>

              <div className="admin-overview-card">

                <div className="overview-card-heading">
                  <div className="overview-icon cancelled">
                    <XCircle size={21} />
                  </div>

                  <span>Cancelled Bookings</span>
                </div>

                <h2>
                  {loading ? "..." : stats?.cancelled_bookings ?? 0}
                </h2>

                <p>Cancelled reservations</p>

              </div>

              <div className="admin-overview-card revenue-card">

                <div className="overview-card-heading">
                  <div className="overview-icon revenue">
                    <IndianRupee size={21} />
                  </div>

                  <span>Total Revenue</span>
                </div>

                <h2>
                  {loading
                    ? "..."
                    : formatCurrency(stats?.total_revenue)}
                </h2>

                <p>From confirmed and paid bookings</p>

              </div>

            </div>

          </section>

          {/* Management */}
          <section className="admin-section">

            <div className="admin-section-heading">
              <div>
                <h2>Quick Management</h2>
                <p>Manage the main areas of your platform.</p>
              </div>
            </div>

            <div className="admin-management-grid">

              {managementItems.map((item) => (
                <div className="admin-management-card" key={item.title}>

                  <div className={`management-icon ${item.color}`}>
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <button onClick={() => navigate(item.path)}>
                    {item.button}
                    <ArrowUpRight size={16} />
                  </button>

                </div>
              ))}

            </div>

          </section>

          {/* Footer */}
          <footer className="admin-footer">
            <span>© 2026 AirBooking Admin Panel</span>
            <span>Management Dashboard</span>
          </footer>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;