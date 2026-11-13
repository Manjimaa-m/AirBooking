import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FlightResults from "./pages/FlightResults";
import FlightDetails from "./pages/FlightDetails";
import Booking from "./pages/Booking";
import MyTrips from "./pages/MyTrips";
import ManageBooking from "./pages/ManageBooking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingUsers from "./pages/admin/PendingUsers";
import ManageFlights from "./pages/admin/ManageFlights";
import LiveFlightStatus from "./pages/admin/LiveFlightStatus";
import ManageBookings from "./pages/admin/ManageBookings";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/flights" element={<FlightResults />} />
        <Route path="/flights/:id" element={<FlightDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/manage-booking" element={<ManageBooking />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<PendingUsers />} />
          <Route path="/admin/flights" element={<ManageFlights />} />
          <Route path="/admin/live-flights" element={<LiveFlightStatus />} />
          <Route path="/live-status" element={<LiveFlightStatus />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;