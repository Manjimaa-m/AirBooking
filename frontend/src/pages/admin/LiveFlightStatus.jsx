import { useEffect, useState } from "react";
import {
  Plane,
  RefreshCw,
  Globe,
  Navigation,
  Gauge,
  MapPin,
  Activity,
  Radio,
} from "lucide-react";

import api from "../../services/api";
import "./LiveFlightStatus.css";

function LiveFlightStatus() {
  const [aircraft, setAircraft] = useState([]);
  const [totalAircraft, setTotalAircraft] = useState(0);
  const [source, setSource] = useState("OpenSky Network");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLiveFlights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("flights/live/");

      setAircraft(response.data.aircraft || []);
      setTotalAircraft(response.data.total_aircraft || 0);
      setSource(response.data.source || "OpenSky Network");
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Unable to fetch live flight information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveFlights();
  }, []);

  const formatAltitude = (altitude) => {
    if (altitude === null || altitude === undefined) return "N/A";
    return `${Math.round(altitude).toLocaleString("en-IN")} m`;
  };

  const formatSpeed = (velocity) => {
    if (velocity === null || velocity === undefined) return "N/A";
    return `${(velocity * 3.6).toFixed(1)} km/h`;
  };

  const formatHeading = (heading) => {
    if (heading === null || heading === undefined) return "N/A";
    return `${Math.round(heading)}°`;
  };

  return (
    <div className="live-flight-page">

      {/* Header */}
      <div className="live-flight-header">
        <div>
          <span className="live-flight-label">
            REAL-TIME MONITORING
          </span>

          <h1>Live Flight Status</h1>

          <p>
            Monitor live aircraft information from the OpenSky Network.
          </p>
        </div>

        <button
          className="live-refresh-btn"
          onClick={fetchLiveFlights}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh Data
        </button>
      </div>

      {/* Live Indicator */}
      <div className="live-source-banner">
        <div className="live-indicator">
          <span></span>
          LIVE DATA
        </div>

        <div className="live-source-info">
          <Radio size={16} />
          Data Source: {source}
        </div>

        <div className="live-last-updated">
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString("en-IN")}`
            : "Waiting for data"}
        </div>
      </div>

      {/* Statistics */}
      <div className="live-stats-grid">

        <div className="live-stat-card">
          <div className="live-stat-icon blue">
            <Plane size={23} />
          </div>

          <div>
            <span>Total Aircraft</span>
            <h2>{totalAircraft.toLocaleString("en-IN")}</h2>
          </div>
        </div>

        <div className="live-stat-card">
          <div className="live-stat-icon green">
            <Activity size={23} />
          </div>

          <div>
            <span>Aircraft Displayed</span>
            <h2>{aircraft.length}</h2>
          </div>
        </div>

        <div className="live-stat-card">
          <div className="live-stat-icon orange">
            <Globe size={23} />
          </div>

          <div>
            <span>Data Provider</span>
            <h2 className="provider-name">OpenSky</h2>
          </div>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="live-error-message">
          {error}
        </div>
      )}

      {/* Aircraft Table */}
      <div className="live-aircraft-card">

        <div className="live-aircraft-heading">
          <div>
            <h3>Aircraft Overview</h3>
            <p>Live aircraft data received from the API.</p>
          </div>

          <span className="live-aircraft-count">
            {aircraft.length} Records
          </span>
        </div>

        {loading ? (
          <div className="live-loading">
            <div className="live-spinner"></div>
            <p>Fetching live aircraft information...</p>
          </div>
        ) : error ? (
          <div className="live-empty">
            <Plane size={35} />
            <h3>Live data unavailable</h3>
            <p>Please try refreshing the data.</p>
          </div>
        ) : aircraft.length === 0 ? (
          <div className="live-empty">
            <Plane size={35} />
            <h3>No aircraft data available</h3>
            <p>The API did not return any aircraft records.</p>
          </div>
        ) : (
          <div className="live-table-wrapper">

            <table className="live-aircraft-table">

              <thead>
                <tr>
                  <th>CALLSIGN</th>
                  <th>ICAO24</th>
                  <th>COUNTRY</th>
                  <th>ALTITUDE</th>
                  <th>SPEED</th>
                  <th>HEADING</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {aircraft.map((plane, index) => (
                  <tr key={`${plane.icao24}-${index}`}>

                    <td>
                      <div className="live-callsign">
                        <div className="live-plane-icon">
                          <Plane size={16} />
                        </div>

                        <strong>
                          {plane.callsign || "Unknown"}
                        </strong>
                      </div>
                    </td>

                    <td className="live-icao">
                      {plane.icao24 || "N/A"}
                    </td>

                    <td>{plane.origin_country || "Unknown"}</td>

                    <td>
                      <div className="live-data-cell">
                        <Navigation size={14} />
                        {formatAltitude(plane.altitude)}
                      </div>
                    </td>

                    <td>
                      <div className="live-data-cell">
                        <Gauge size={14} />
                        {formatSpeed(plane.velocity)}
                      </div>
                    </td>

                    <td>{formatHeading(plane.heading)}</td>

                    <td>
                      <div className="live-location">
                        <MapPin size={14} />

                        {plane.latitude != null &&
                        plane.longitude != null
                          ? `${plane.latitude.toFixed(2)}, ${plane.longitude.toFixed(2)}`
                          : "N/A"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          plane.on_ground
                            ? "live-ground-status"
                            : "live-air-status"
                        }
                      >
                        {plane.on_ground ? "On Ground" : "Airborne"}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

      <p className="live-disclaimer">
        Flight information is provided by OpenSky Network.
        Availability and accuracy depend on the external data provider.
      </p>

    </div>
  );
}

export default LiveFlightStatus;