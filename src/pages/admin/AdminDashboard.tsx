import React, { useEffect, useState } from "react";
import { adminController, Customer, Driver, Shop } from "./AdminController";
import "../Admin.css";

type Tab = "customers" | "drivers" | "shops";

interface State {
  customers: Customer[];
  drivers: Driver[];
  shops: Shop[];
}

export default function AdminDashboard() {
  const [state, setState] = useState<State>({ customers: [], drivers: [], shops: [] });
  const [activeTab, setActiveTab] = useState<Tab>("customers");
  const [suspendReason, setSuspendReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const unsub = adminController.subscribe(setState);
    return unsub;
  }, []);

  const handleSuspend = (id: number, type: Tab, reason: string) => {
    if (!reason.trim()) {
      alert("Please provide a suspension reason");
      return;
    }
    if (type === "customers") adminController.suspendCustomer(id, reason);
    else if (type === "drivers") adminController.suspendDriver(id, reason);
    else if (type === "shops") adminController.suspendShop(id, reason);
    setSuspendReason("");
    setSelectedUserId(null);
  };

  const handleUnsuspend = (id: number, type: Tab) => {
    if (type === "customers") adminController.unsuspendCustomer(id);
    else if (type === "drivers") adminController.unsuspendDriver(id);
    else if (type === "shops") adminController.unsuspendShop(id);
  };

  const renderStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      active: "status-badge active",
      suspended: "status-badge suspended",
      pending: "status-badge pending",
      rejected: "status-badge rejected",
    };
    return <span className={classes[status] || "status-badge"}>{status.toUpperCase()}</span>;
  };

  const renderViolations = (violations: any[]) => {
    if (!violations.length) return <div className="muted text-sm">No violations</div>;
    return violations.map((v) => (
      <div key={v.id} className="violation-item">
        <strong>{v.type}</strong>: {v.reason} ({new Date(v.date).toLocaleDateString()})
      </div>
    ));
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1>Admin Control Center</h1>
        <p className="subtitle">Manage customers, drivers, and shops</p>
      </header>

      {/* TAB NAVIGATION */}
      <nav className="admin-tabs">
        <button className={`tab-btn ${activeTab === "customers" ? "active" : ""}`} onClick={() => setActiveTab("customers")}>
          👥 Customers ({state.customers.length})
        </button>
        <button className={`tab-btn ${activeTab === "drivers" ? "active" : ""}`} onClick={() => setActiveTab("drivers")}>
          🏍️ Drivers ({state.drivers.length})
        </button>
        <button className={`tab-btn ${activeTab === "shops" ? "active" : ""}`} onClick={() => setActiveTab("shops")}>
          🛒 Shops ({state.shops.length})
        </button>
      </nav>

      {/* CUSTOMERS TAB */}
      {activeTab === "customers" && (
        <section className="admin-section">
          <h2>Customers</h2>
          <div className="entity-grid">
            {state.customers.map((c) => (
              <div key={c.id} className={`entity-card ${c.status}`}>
                <div className="entity-header">
                  <div>
                    <strong>{c.name}</strong>
                    <div className="muted">{c.email}</div>
                  </div>
                  {renderStatusBadge(c.status)}
                </div>

                <div className="entity-body">
                  <p>Phone: {c.phone}</p>
                  <p className="muted">Joined: {new Date(c.joinedAt).toLocaleDateString()}</p>
                  <div className="violations">
                    <strong>Violations:</strong>
                    {renderViolations(c.violations)}
                  </div>
                </div>

                <div className="entity-actions">
                  {c.status === "active" && (
                    <>
                      {selectedUserId === c.id ? (
                        <div className="suspend-form">
                          <textarea
                            placeholder="Reason for suspension..."
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                          />
                          <button className="danger" onClick={() => handleSuspend(c.id, "customers", suspendReason)}>
                            Suspend
                          </button>
                          <button className="secondary" onClick={() => setSelectedUserId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button className="danger" onClick={() => setSelectedUserId(c.id)}>
                          Suspend
                        </button>
                      )}
                    </>
                  )}
                  {c.status === "suspended" && (
                    <button className="success" onClick={() => handleUnsuspend(c.id, "customers")}>
                      Unsuspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DRIVERS TAB */}
      {activeTab === "drivers" && (
        <section className="admin-section">
          <h2>Drivers</h2>
          <div className="entity-grid">
            {state.drivers.map((d) => (
              <div key={d.id} className={`entity-card ${d.status}`}>
                <div className="entity-header">
                  <div>
                    <strong>{d.name}</strong>
                    <div className="muted">{d.email}</div>
                  </div>
                  {renderStatusBadge(d.status)}
                </div>

                <div className="entity-body">
                  <p>Phone: {d.phone}</p>
                  <p>Bike: {d.bike}</p>
                  {d.approvedAt && <p className="muted">Approved: {new Date(d.approvedAt).toLocaleDateString()}</p>}
                  <div className="violations">
                    <strong>Violations:</strong>
                    {renderViolations(d.violations)}
                  </div>
                </div>

                <div className="entity-actions">
                  {d.status === "active" && (
                    <>
                      {selectedUserId === d.id ? (
                        <div className="suspend-form">
                          <textarea
                            placeholder="Reason for suspension..."
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                          />
                          <button className="danger" onClick={() => handleSuspend(d.id, "drivers", suspendReason)}>
                            Suspend
                          </button>
                          <button className="secondary" onClick={() => setSelectedUserId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button className="danger" onClick={() => setSelectedUserId(d.id)}>
                          Suspend
                        </button>
                      )}
                    </>
                  )}
                  {d.status === "suspended" && (
                    <button className="success" onClick={() => handleUnsuspend(d.id, "drivers")}>
                      Unsuspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHOPS TAB */}
      {activeTab === "shops" && (
        <section className="admin-section">
          <h2>Shops</h2>
          <div className="entity-grid">
            {state.shops.map((s) => (
              <div key={s.id} className={`entity-card ${s.status}`}>
                <div className="entity-header">
                  <div>
                    <strong>{s.name}</strong>
                    <div className="muted">Owner: {s.owner}</div>
                  </div>
                  {renderStatusBadge(s.status)}
                </div>

                <div className="entity-body">
                  <p>Phone: {s.phone}</p>
                  <p className="muted">Registered: {new Date(s.registeredAt).toLocaleDateString()}</p>
                  <div className="violations">
                    <strong>Violations:</strong>
                    {renderViolations(s.violations)}
                  </div>
                </div>

                <div className="entity-actions">
                  {s.status === "active" && (
                    <>
                      {selectedUserId === s.id ? (
                        <div className="suspend-form">
                          <textarea
                            placeholder="Reason for suspension..."
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                          />
                          <button className="danger" onClick={() => handleSuspend(s.id, "shops", suspendReason)}>
                            Suspend
                          </button>
                          <button className="secondary" onClick={() => setSelectedUserId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button className="danger" onClick={() => setSelectedUserId(s.id)}>
                          Suspend
                        </button>
                      )}
                    </>
                  )}
                  {s.status === "suspended" && (
                    <button className="success" onClick={() => handleUnsuspend(s.id, "shops")}>
                      Unsuspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
