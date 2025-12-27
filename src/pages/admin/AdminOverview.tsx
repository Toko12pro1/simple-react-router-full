import React, { useEffect, useState } from "react";
import { adminController } from "./AdminController";

interface AdminOverviewState {
  ridestoday: number;
  ordersToday: number;
  activeDrivers: number;
  activeUsers: number;
  totalRevenue: number;
  driverPayoutsDue: number;
  ongoingRides: number;
  criticalAlerts: string[];
}

export default function AdminOverview() {
  const [state, setState] = useState<AdminOverviewState>({
    ridestoday: 0,
    ordersToday: 0,
    activeDrivers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    driverPayoutsDue: 0,
    ongoingRides: 0,
    criticalAlerts: [],
  });

  useEffect(() => {
    const unsubscribe = adminController.subscribe((adminState) => {
      const metrics = adminController.calculateDailyMetrics();
      const financialData = adminController.getFinancialData();
      const ongoingRides = adminController.getRides({ status: "in-progress" }).length;
      
      // Calculate total revenue (rides + orders)
      const totalRevenue = financialData.rideRevenue + financialData.orderRevenue;

      // Identify critical alerts
      const alerts: string[] = [];
      if (metrics.ridestoday > 50) {
        alerts.push(`High ride volume today: ${metrics.ridestoday} rides`);
      }
      const cancelledRides = adminController.getRides({ status: "cancelled" }).length;
      if (cancelledRides > 5) {
        alerts.push(`Many cancelled rides today: ${cancelledRides} cancellations`);
      }
      if (financialData.refundsToday > 10000) {
        alerts.push(`High refunds processed: ₦${financialData.refundsToday.toLocaleString()}`);
      }

      setState({
        ridestoday: metrics.ridestoday,
        ordersToday: metrics.ordersToday,
        activeDrivers: metrics.activeDrivers,
        activeUsers: metrics.activeUsers,
        totalRevenue,
        driverPayoutsDue: financialData.driverPayoutsDue,
        ongoingRides,
        criticalAlerts: alerts,
      });
    });

    return unsubscribe;
  }, []);

  const KPICard = ({ title, value, unit = "", icon }: { title: string; value: number; unit?: string; icon: string }) => (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <h3 className="kpi-title">{title}</h3>
        <p className="kpi-value">
          {value.toLocaleString()} {unit}
        </p>
      </div>
    </div>
  );

  const LiveTile = ({ title, value, status, description }: { title: string; value: number; status: "ongoing" | "pending" | "alert"; description?: string }) => (
    <div className={`live-tile live-tile-${status}`}>
      <div className="live-tile-header">
        <h3>{title}</h3>
        <span className={`live-badge live-badge-${status}`}>●</span>
      </div>
      <p className="live-tile-value">{value.toLocaleString()}</p>
      {description && <p className="live-tile-desc">{description}</p>}
    </div>
  );

  return (
    <div className="container">
      <div className="card admin-overview">
        <div className="page-header">
          <h2 className="page-title">Overview</h2>
          <div className="controls">
            <button className="btn btn-ghost" onClick={() => { const m = adminController.calculateDailyMetrics(); console.log('refresh', m); }}>Refresh</button>
          </div>
        </div>
      {/* KPI Section */}
      <div className="overview-section">
        <h2 className="section-title">📊 Key Performance Indicators</h2>
        <div className="kpi-grid">
          <KPICard title="Total Rides Today" value={state.ridestoday} icon="🚗" />
          <KPICard title="Total Orders Today" value={state.ordersToday} icon="📦" />
          <KPICard title="Active Drivers" value={state.activeDrivers} icon="👨‍💼" />
          <KPICard title="Active Users" value={state.activeUsers} icon="👥" />
          <KPICard title="Total Revenue" value={state.totalRevenue} unit="₦" icon="💰" />
          <KPICard title="Driver Payouts Due" value={state.driverPayoutsDue} unit="₦" icon="💳" />
        </div>
      </div>

      {/* Live Operations Section */}
      <div className="overview-section">
        <h2 className="section-title">🔴 Live Operations</h2>
        <div className="live-tiles-grid">
          <LiveTile
            title="Ongoing Rides"
            value={state.ongoingRides}
            status="ongoing"
            description="Rides currently in progress"
          />
          <LiveTile
            title="Pending Approvals"
            value={adminController.getDrivers({ status: "pending" }).length}
            status="pending"
            description="New drivers awaiting approval"
          />
          <LiveTile
            title="System Alerts"
            value={state.criticalAlerts.length}
            status="alert"
            description="Critical system issues"
          />
        </div>
      </div>

      {/* Critical Alerts Section */}
      {state.criticalAlerts.length > 0 && (
        <div className="overview-section">
          <h2 className="section-title">⚠️ Critical Alerts</h2>
          <div className="alerts-list">
            {state.criticalAlerts.map((alert, idx) => (
              <div key={idx} className="alert-item">
                <span className="alert-icon">🔔</span>
                <span className="alert-text">{alert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="overview-section">
        <h2 className="section-title">📈 Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <h4>Average Driver Rating</h4>
            <p className="stat-value">4.7/5.0 ⭐</p>
          </div>
          <div className="stat-box">
            <div className="stat-box">
            <h4>Cancellation Rate</h4>
            <p className="stat-value">2.3%</p>
          </div>
          </div>
          <div className="stat-box">
            <h4>Top-ups Today</h4>
            <p className="stat-value">₦25,000</p>
          </div>
          <div className="stat-box">
            <h4>Refunds Today</h4>
            <p className="stat-value">₦5,000</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
