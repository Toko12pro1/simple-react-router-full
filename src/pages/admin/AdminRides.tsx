import React, { useEffect, useState } from "react";
import { adminController, Ride, Order, RideStatus, OrderStatus } from "./AdminController";

type OperationType = "rides" | "deliveries";

export default function AdminRides() {
  const [operationType, setOperationType] = useState<OperationType>("rides");
  const [rides, setRides] = useState<Ride[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | Order | null>(null);
  const [reassignDriverId, setReassignDriverId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = adminController.subscribe((state) => {
      setRides(state.rides);
      setOrders(state.orders);
      setDrivers(state.drivers);
    });
    return unsubscribe;
  }, []);

  const getFilteredRides = () => {
    return rides.filter((r) => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      return true;
    });
  };

  const getFilteredOrders = () => {
    return orders.filter((o) => {
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      return true;
    });
  };

  const handleReassignRide = (rideId: string, newDriverId: number) => {
    if (!reassignDriverId) {
      alert("Please select a driver");
      return;
    }
    adminController.reassignRide(rideId, newDriverId);
    setReassignDriverId("");
    setSelectedRide(null);
  };

  const handleReassignOrder = (orderId: string, newDriverId: number) => {
    if (!reassignDriverId) {
      alert("Please select a driver");
      return;
    }
    adminController.assignOrder(orderId, newDriverId);
    setReassignDriverId("");
    setSelectedRide(null);
  };

  const getStatusColor = (status: string) => {
    if (status === "pending") return "status-pending";
    if (status === "assigned") return "status-assigned";
    if (status === "in-progress" || status === "in-delivery") return "status-inprogress";
    if (status === "completed") return "status-completed";
    return "status-cancelled";
  };

  const RideCard = ({ ride }: { ride: Ride }) => (
    <div className="operation-card" onClick={() => setSelectedRide(ride)}>
      <div className="card-header">
        <h3>{ride.pickupLocation} → {ride.dropoffLocation}</h3>
        <span className={`status-badge ${getStatusColor(ride.status)}`}>{ride.status}</span>
      </div>
      <div className="card-details">
        <p>🚗 Customer ID: {ride.customerId}</p>
        <p>👨‍💼 Driver: {ride.driverId ? `#${ride.driverId}` : "Unassigned"}</p>
        <p>💰 Fare: ₦{ride.fare.toLocaleString()}</p>
        <p>📍 Distance: {ride.distance} km</p>
        <p>📅 {new Date(ride.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="operation-card" onClick={() => setSelectedRide(order)}>
      <div className="card-header">
        <h3>Order #{order.id.split("-")[1]}</h3>
        <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
      </div>
      <div className="card-details">
        <p>👤 Customer ID: {order.customerId}</p>
        <p>🏪 Shop ID: {order.shopId}</p>
        <p>👨‍💼 Driver: {order.driverId ? `#${order.driverId}` : "Unassigned"}</p>
        <p>💰 Total: ₦{order.total.toLocaleString()}</p>
        <p>📅 {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );

  const RideDetailPanel = () => {
    if (!selectedRide) return null;

    const isRide = "pickupLocation" in selectedRide;
    const ride = selectedRide as Ride;
    const order = selectedRide as Order;

    return (
      <div className="detail-panel">
        <button className="close-btn" onClick={() => setSelectedRide(null)}>✕</button>
        <h2>{isRide ? "Ride Details" : "Order Details"}</h2>

        <div className="detail-section">
          {isRide ? (
            <>
              <h3>
                {ride.pickupLocation} → {ride.dropoffLocation}
              </h3>
              <p>
                <strong>Ride ID:</strong> {ride.id}
              </p>
              <p>
                <strong>Customer ID:</strong> {ride.customerId}
              </p>
              <p>
                <strong>Driver ID:</strong> {ride.driverId || "Unassigned"}
              </p>
              <p>
                <strong>Status:</strong> <span className={`status-badge ${getStatusColor(ride.status)}`}>{ride.status}</span>
              </p>
              <p>
                <strong>Fare:</strong> ₦{ride.fare.toLocaleString()}
              </p>
              <p>
                <strong>Distance:</strong> {ride.distance} km
              </p>
              <p>
                <strong>Penalties:</strong> ₦{ride.penalties}
              </p>
              <p>
                <strong>Created:</strong> {new Date(ride.createdAt).toLocaleString()}
              </p>
              {ride.startedAt && (
                <p>
                  <strong>Started:</strong> {new Date(ride.startedAt).toLocaleString()}
                </p>
              )}
              {ride.completedAt && (
                <p>
                  <strong>Completed:</strong> {new Date(ride.completedAt).toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <>
              <h3>Order #{order.id.split("-")[1]}</h3>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Customer ID:</strong> {order.customerId}
              </p>
              <p>
                <strong>Shop ID:</strong> {order.shopId}
              </p>
              <p>
                <strong>Driver ID:</strong> {order.driverId || "Unassigned"}
              </p>
              <p>
                <strong>Status:</strong> <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
              </p>
              <p>
                <strong>Total:</strong> ₦{order.total.toLocaleString()}
              </p>
              <p>
                <strong>Items:</strong> {order.items.join(", ")}
              </p>
              <p>
                <strong>Penalties:</strong> ₦{order.penalties}
              </p>
              <p>
                <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              {order.completedAt && (
                <p>
                  <strong>Completed:</strong> {new Date(order.completedAt).toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>

        {/* Timeline */}
        <div className="detail-section">
          <h4>📅 Timeline</h4>
          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-marker">●</div>
              <div className="timeline-content">
                <strong>Order Created</strong>
                <p>{new Date(isRide ? ride.createdAt : order.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {(isRide ? ride.status !== "pending" : order.status !== "pending") && (
              <div className={`timeline-item ${isRide ? ride.status === "completed" ? "completed" : "inprogress" : order.status === "completed" ? "completed" : "inprogress"}`}>
                <div className="timeline-marker">●</div>
                <div className="timeline-content">
                  <strong>Driver Assigned</strong>
                  <p>{isRide ? ride.driverId || "Pending" : order.driverId || "Pending"}</p>
                </div>
              </div>
            )}
            {(isRide ? ride.status === "in-progress" : order.status === "in-delivery" || order.status === "completed") && (
              <div className={`timeline-item ${isRide ? "inprogress" : order.status === "completed" ? "completed" : "inprogress"}`}>
                <div className="timeline-marker">●</div>
                <div className="timeline-content">
                  <strong>{isRide ? "In Progress" : "In Delivery"}</strong>
                  <p>{isRide ? ride.startedAt ? new Date(ride.startedAt).toLocaleString() : "Active now" : "Delivery in progress"}</p>
                </div>
              </div>
            )}
            {((isRide && ride.status === "completed") || (!isRide && order.status === "completed")) && (
              <div className="timeline-item completed">
                <div className="timeline-marker">●</div>
                <div className="timeline-content">
                  <strong>Completed</strong>
                  <p>{isRide ? ride.completedAt ? new Date(ride.completedAt).toLocaleString() : "N/A" : order.completedAt ? new Date(order.completedAt).toLocaleString() : "N/A"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reassign Driver */}
        {(isRide ? ride.status === "pending" || ride.status === "assigned" : order.status === "pending" || order.status === "assigned") && (
          <div className="detail-section suspend-form">
            <h4>Reassign Driver</h4>
            <select
              title="Select driver"
              value={reassignDriverId}
              onChange={(e) => setReassignDriverId(e.target.value)}
              className="filter-select"
            >
              <option value="">Select a driver...</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} (Rating: {d.rating})
                </option>
              ))}
            </select>
            <button
              className="btn-approve"
              onClick={() => {
                const driverId = parseInt(reassignDriverId);
                if (isRide) handleReassignRide(ride.id, driverId);
                else handleReassignOrder(order.id, driverId);
              }}
            >
              Reassign Driver
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="card admin-rides">
        <div className="page-header">
          <h2 className="page-title">Rides & Deliveries</h2>
          <div className="controls">
            <div>
              <button className={`btn ${operationType === "rides" ? "btn-primary" : "btn-ghost"}`} onClick={() => setOperationType("rides")}>🚗 Rides</button>
              <button className={`btn ${operationType === "deliveries" ? "btn-primary" : "btn-ghost"}`} onClick={() => setOperationType("deliveries")}>📦 Deliveries</button>
            </div>
            <select title="Filter status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="in-delivery">In Delivery</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="rides-container">
        {/* Main Content */}
        <div className="rides-list">
          {operationType === "rides" && (
            <>
              <h2>Live Rides ({getFilteredRides().length})</h2>
              <div className="operation-grid">
                {getFilteredRides().map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            </>
          )}

          {operationType === "deliveries" && (
            <>
              <h2>Live Deliveries ({getFilteredOrders().length})</h2>
              <div className="operation-grid">
                {getFilteredOrders().map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detail Panel */}
        {selectedRide && <RideDetailPanel />}
      </div>
      </div>
    </div>
  );
}
