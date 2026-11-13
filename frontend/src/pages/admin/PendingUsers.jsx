import { useEffect, useState } from "react";
import { Check, X, Users, RefreshCw, Mail, ShieldCheck } from "lucide-react";
import api from "../../services/api";
import "./PendingUsers.css";

function PendingUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("auth/admin/users/pending/");
      setUsers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load pending users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleUserAction = async (userId, action) => {
    const actionName = action === "approve" ? "approve" : "reject";

    try {
      setActionLoading(userId);
      setMessage("");
      setError("");

      const response = await api.post(
        `auth/admin/users/${userId}/${actionName}/`
      );

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== userId)
      );

      setMessage(
        response.data.message ||
        `User ${actionName}d successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        `Unable to ${actionName} user. Please try again.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="pending-users-page">
      <div className="pending-users-header">
        <div>
          <span className="admin-page-label">USER MANAGEMENT</span>
          <h1>Pending Approvals</h1>
          <p>Review and manage new user registration requests.</p>
        </div>

        <button
          className="pending-refresh-btn"
          onClick={fetchPendingUsers}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "refresh-spinning" : ""} />
          Refresh
        </button>
      </div>

      <div className="pending-summary-card">
        <div className="pending-summary-icon">
          <Users size={25} />
        </div>

        <div>
          <span>Pending Requests</span>
          <h2>{users.length}</h2>
        </div>

        <div className="pending-summary-status">
          <span className="pending-status-dot"></span>
          Awaiting Review
        </div>
      </div>

      {message && (
        <div className="pending-success-message">
          <ShieldCheck size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="pending-error-message">
          {error}
        </div>
      )}

      <div className="pending-table-card">
        <div className="pending-table-heading">
          <div>
            <h3>Registration Requests</h3>
            <p>Users waiting for administrator approval</p>
          </div>

          <span className="pending-count">{users.length} Users</span>
        </div>

        {loading ? (
          <div className="pending-loading">
            <div className="pending-spinner"></div>
            <p>Loading user requests...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="pending-empty">
            <div className="pending-empty-icon">
              <Check size={30} />
            </div>
            <h3>All caught up!</h3>
            <p>There are no pending user approval requests.</p>
          </div>
        ) : (
          <div className="pending-table-wrapper">
            <table className="pending-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL ADDRESS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="pending-user-info">
                        <div className="pending-avatar">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{user.username}</strong>
                          <span>User ID: #{user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="pending-email">
                        <Mail size={15} />
                        {user.email}
                      </div>
                    </td>

                    <td>
                      <span className="pending-badge">
                        <span></span>
                        {user.approval_status}
                      </span>
                    </td>

                    <td>
                      <div className="pending-actions">
                        <button
                          className="pending-approve-btn"
                          onClick={() =>
                            handleUserAction(user.id, "approve")
                          }
                          disabled={actionLoading !== null}
                        >
                          <Check size={16} />
                          {actionLoading === user.id ? "Processing..." : "Approve"}
                        </button>

                        <button
                          className="pending-reject-btn"
                          onClick={() =>
                            handleUserAction(user.id, "reject")
                          }
                          disabled={actionLoading !== null}
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>
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

export default PendingUsers;