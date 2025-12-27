import React, { useState } from "react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (login(username, password)) {
        setUsername("");
        setPassword("");
      } else {
        setError("Invalid username or password. Try admin / admin123");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <h1>🎛️ Admin Control</h1>
          <p>Secure Access</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="login-hint">
            <p className="small-muted">Demo credentials: <strong>admin</strong> / <strong>admin123</strong></p>
          </div>
        </form>
      </div>
    </div>
  );
}
