import React, { useState } from "react";
import AdminOverview from "./admin/AdminOverview";
import AdminUsers from "./admin/AdminUsers";
import AdminRides from "./admin/AdminRides";
import AdminPricing from "./admin/AdminPricing";
import AdminFinance from "./admin/AdminFinance";
import AdminLogin from "./AdminLogin";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import "./AdminStyles.css";

type DashboardTab = "overview" | "users" | "rides" | "pricing" | "finance";

export default function Admin() {
  const { isLoggedIn, adminName, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  const renderDashboard = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <AdminUsers />;
      case "rides":
        return <AdminRides />;
      case "pricing":
        return <AdminPricing />;
      case "finance":
        return <AdminFinance />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="container">
      <div className="admin-container">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1>🎛️ Admin Control</h1>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Overview</span>
          </button>

          <button
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Users & Drivers</span>
          </button>

          <button
            className={`nav-item ${activeTab === "rides" ? "active" : ""}`}
            onClick={() => setActiveTab("rides")}
          >
            <span className="nav-icon">🚗</span>
            <span className="nav-label">Rides & Deliveries</span>
          </button>

          <button
            className={`nav-item ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => setActiveTab("pricing")}
          >
            <span className="nav-icon">💰</span>
            <span className="nav-label">Pricing & Promotions</span>
          </button>

          <button
            className={`nav-item ${activeTab === "finance" ? "active" : ""}`}
            onClick={() => setActiveTab("finance")}
          >
            <span className="nav-icon">💳</span>
            <span className="nav-label">Finance & Reports</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>🟢 System Online</p>
          <p className="text-sm">Admin: {adminName}</p>
          <button type="button" className="btn btn-ghost logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="page-header">
          <h2 className="page-title">Admin Control</h2>
          <div className="controls">
            <div className="muted">Manage users, rides and finances</div>
          </div>
        </div>

        <div className="card">{renderDashboard()}</div>
      </div>
      </div>
    </div>
  );
}
