import React, { useEffect, useState } from "react";
import { adminController, Customer, Driver, Shop } from "./AdminController";

type UserTab = "users" | "drivers" | "shops";

interface SelectedEntity {
  type: "customer" | "driver" | "shop";
  id: number;
  data: Customer | Driver | Shop | null;
}

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<UserTab>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Customer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const unsubscribe = adminController.subscribe((state) => {
      setUsers(state.customers);
      setDrivers(state.drivers);
      setShops(state.shops);
    });
    return unsubscribe;
  }, []);

  const getFilteredUsers = () => {
    return users.filter((u) => {
      if (filterStatus !== "all" && u.status !== filterStatus) return false;
      if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const getFilteredDrivers = () => {
    return drivers.filter((d) => {
      if (filterStatus !== "all" && d.status !== filterStatus) return false;
      if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const getFilteredShops = () => {
    return shops.filter((s) => {
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const handleSuspend = (id: number, type: "customer" | "driver" | "shop") => {
    if (!suspendReason.trim()) {
      alert("Please enter a reason for suspension");
      return;
    }
    if (type === "customer") adminController.suspendCustomer(id, suspendReason);
    else if (type === "driver") adminController.suspendDriver(id, suspendReason);
    else adminController.suspendShop(id, suspendReason);
    setSuspendReason("");
    setSelectedEntity(null);
  };

  const handleUnsuspend = (id: number, type: "customer" | "driver" | "shop") => {
    if (type === "customer") adminController.unsuspendCustomer(id);
    else if (type === "driver") adminController.unsuspendDriver(id);
    else adminController.unsuspendShop(id);
    setSelectedEntity(null);
  };

  const handleApproveDriver = (id: number) => {
    adminController.approveDriver(id);
    setSelectedEntity(null);
  };

  const handleApproveShop = (id: number) => {
    adminController.approveShop(id);
    setSelectedEntity(null);
  };

  const getStatusColor = (status: string) => {
    if (status === "active") return "status-active";
    if (status === "suspended") return "status-suspended";
    if (status === "pending") return "status-pending";
    return "status-rejected";
  };

  const EntityCard = ({ entity, type }: { entity: Customer | Driver | Shop; type: "customer" | "driver" | "shop" }) => {
    const name = type === "driver" ? (entity as Driver).name : type === "shop" ? (entity as Shop).name : (entity as Customer).name;
    const status = entity.status;
    const rating = type === "driver" ? (entity as Driver).rating : type === "shop" ? (entity as Shop).rating : (entity as Customer).rating;

    return (
      <div className="entity-card" onClick={() => setSelectedEntity({ type, id: entity.id, data: entity })}>
        <div className="entity-header">
          <h3>{name}</h3>
          <span className={`status-badge ${getStatusColor(status)}`}>{status}</span>
        </div>
        <div className="entity-details">
          {type === "customer" && (
            <>
              <p>📧 {(entity as Customer).email}</p>
              <p>👤 {(entity as Customer).profileType}</p>
              <p>🏷️ Rides: {(entity as Customer).totalRides}</p>
              <p>⭐ {(entity as Customer).rating.toFixed(1)}/5.0</p>
            </>
          )}
          {type === "driver" && (
            <>
              <p>📧 {(entity as Driver).email}</p>
              <p>🏍️ {(entity as Driver).bike}</p>
              <p>🏷️ Trips: {(entity as Driver).totalTrips}</p>
              <p>⭐ {(entity as Driver).rating.toFixed(1)}/5.0</p>
            </>
          )}
          {type === "shop" && (
            <>
              <p>👤 {(entity as Shop).owner}</p>
              <p>🏷️ {(entity as Shop).category}</p>
              <p>📦 Products: {(entity as Shop).productCount}</p>
              <p>⭐ {(entity as Shop).rating.toFixed(1)}/5.0</p>
            </>
          )}
        </div>
      </div>
    );
  };

  const DetailPanel = () => {
    if (!selectedEntity || !selectedEntity.data) return null;
    const entity = selectedEntity.data;

    return (
      <div className="detail-panel">
        <button className="close-btn" onClick={() => setSelectedEntity(null)}>✕</button>
        <h2>Entity Details</h2>

        {selectedEntity.type === "customer" && (
          <>
            <div className="detail-section">
              <h3>{(entity as Customer).name}</h3>
              <p><strong>Email:</strong> {(entity as Customer).email}</p>
              <p><strong>Phone:</strong> {(entity as Customer).phone}</p>
              <p><strong>Profile Type:</strong> {(entity as Customer).profileType}</p>
              <p><strong>Status:</strong> {(entity as Customer).status}</p>
              <p><strong>Wallet Balance:</strong> ₦{(entity as Customer).wallet.toLocaleString()}</p>
              <p><strong>Total Rides:</strong> {(entity as Customer).totalRides}</p>
              <p><strong>Rating:</strong> ⭐ {(entity as Customer).rating}/5.0</p>
              <p><strong>Member Since:</strong> {new Date((entity as Customer).joinedAt).toLocaleDateString()}</p>
            </div>

            {(entity as Customer).violations.length > 0 && (
              <div className="detail-section">
                <h4>Violation History</h4>
                {(entity as Customer).violations.map((v) => (
                  <div key={v.id} className="violation-item">
                    <p><strong>{v.type}</strong> - {v.date && new Date(v.date).toLocaleDateString()}</p>
                    <p>{v.reason}</p>
                  </div>
                ))}
              </div>
            )}

            {entity.status === "active" && (
              <div className="detail-section suspend-form">
                <h4>Suspend This User</h4>
                <textarea
                  placeholder="Enter suspension reason..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                />
                <button
                  className="btn-suspend"
                  onClick={() => handleSuspend(entity.id, "customer")}
                >
                  Suspend User
                </button>
              </div>
            )}

            {entity.status === "suspended" && (
              <button
                className="btn-unsuspend"
                onClick={() => handleUnsuspend(entity.id, "customer")}
              >
                Unsuspend User
              </button>
            )}
          </>
        )}

        {selectedEntity.type === "driver" && (
          <>
            <div className="detail-section">
              <h3>{(entity as Driver).name}</h3>
              <p><strong>Email:</strong> {(entity as Driver).email}</p>
              <p><strong>Phone:</strong> {(entity as Driver).phone}</p>
              <p><strong>Bike:</strong> {(entity as Driver).bike}</p>
              <p><strong>Status:</strong> {(entity as Driver).status}</p>
              <p><strong>Total Trips:</strong> {(entity as Driver).totalTrips}</p>
              <p><strong>Earnings:</strong> ₦{(entity as Driver).earnings.toLocaleString()}</p>
              <p><strong>Rating:</strong> ⭐ {(entity as Driver).rating}/5.0</p>
              <p><strong>Cancel Rate:</strong> {(entity as Driver).cancelRate}%</p>
              {(entity as Driver).approvedAt && (
                <p><strong>Approved:</strong> {new Date((entity as Driver).approvedAt!).toLocaleDateString()}</p>
              )}
            </div>

            {entity.status === "pending" && (
              <div className="detail-section">
                <button className="btn-approve" onClick={() => handleApproveDriver(entity.id)}>
                  ✓ Approve Driver
                </button>
              </div>
            )}

            {entity.status === "active" && (
              <div className="detail-section suspend-form">
                <h4>Suspend This Driver</h4>
                <textarea
                  placeholder="Enter suspension reason..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                />
                <button
                  className="btn-suspend"
                  onClick={() => handleSuspend(entity.id, "driver")}
                >
                  Suspend Driver
                </button>
              </div>
            )}

            {entity.status === "suspended" && (
              <button
                className="btn-unsuspend"
                onClick={() => handleUnsuspend(entity.id, "driver")}
              >
                Unsuspend Driver
              </button>
            )}
          </>
        )}

        {selectedEntity.type === "shop" && (
          <>
            <div className="detail-section">
              <h3>{(entity as Shop).name}</h3>
              <p><strong>Owner:</strong> {(entity as Shop).owner}</p>
              <p><strong>Phone:</strong> {(entity as Shop).phone}</p>
              <p><strong>Category:</strong> {(entity as Shop).category}</p>
              <p><strong>Status:</strong> {(entity as Shop).status}</p>
              <p><strong>Products:</strong> {(entity as Shop).productCount}</p>
              <p><strong>Orders Accepted:</strong> {(entity as Shop).ordersAccepted}</p>
              <p><strong>Orders Rejected:</strong> {(entity as Shop).ordersRejected}</p>
              <p><strong>Rating:</strong> ⭐ {(entity as Shop).rating}/5.0</p>
              <p><strong>Registered:</strong> {new Date((entity as Shop).registeredAt).toLocaleDateString()}</p>
            </div>

            {entity.status === "pending" && (
              <div className="detail-section">
                <button className="btn-approve" onClick={() => handleApproveShop(entity.id)}>
                  ✓ Approve Shop
                </button>
              </div>
            )}

            {entity.status === "active" && (
              <div className="detail-section suspend-form">
                <h4>Suspend This Shop</h4>
                <textarea
                  placeholder="Enter suspension reason..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                />
                <button
                  className="btn-suspend"
                  onClick={() => handleSuspend(entity.id, "shop")}
                >
                  Suspend Shop
                </button>
              </div>
            )}

            {entity.status === "suspended" && (
              <button
                className="btn-unsuspend"
                onClick={() => handleUnsuspend(entity.id, "shop")}
              >
                Unsuspend Shop
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="card admin-users">
        <div className="page-header">
          <h2 className="page-title">Users & Drivers</h2>
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              title="Search users"
            />
            <select title="Filter status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="controls">
              <button className={`btn ${activeTab === "users" ? "btn-primary" : "btn-ghost"}`} onClick={() => setActiveTab("users")}>👥 Users</button>
              <button className={`btn ${activeTab === "drivers" ? "btn-primary" : "btn-ghost"}`} onClick={() => setActiveTab("drivers")}>👨‍💼 Drivers</button>
              <button className={`btn ${activeTab === "shops" ? "btn-primary" : "btn-ghost"}`} onClick={() => setActiveTab("shops")}>🏪 Shops</button>
            </div>
          </div>

        </div>

        <div className="users-container">
          <div className="users-list">
            {activeTab === "users" && (
              <>
                <h3>Users ({getFilteredUsers().length})</h3>
                <div className="entity-grid">
                  {getFilteredUsers().map((user) => (
                    <EntityCard key={user.id} entity={user} type="customer" />
                  ))}
                </div>
              </>
            )}

            {activeTab === "drivers" && (
              <>
                <h3>Drivers ({getFilteredDrivers().length})</h3>
                <div className="entity-grid">
                  {getFilteredDrivers().map((driver) => (
                    <EntityCard key={driver.id} entity={driver} type="driver" />
                  ))}
                </div>
              </>
            )}

            {activeTab === "shops" && (
              <>
                <h3>Shops ({getFilteredShops().length})</h3>
                <div className="entity-grid">
                  {getFilteredShops().map((shop) => (
                    <EntityCard key={shop.id} entity={shop} type="shop" />
                  ))}
                </div>
              </>
            )}
          </div>

          {selectedEntity && <DetailPanel />}
        </div>
      </div>
    </div>
  );
}
