import React, { useState } from "react";
import { navigate } from "../router";
import "./Customer.css";
import MapModal from "../components/MapModal";
import { useProfile } from "../contexts/ProfileContext";

type RideMode = "normal" | "cheap";

type RideStatus =
  | "idle"
  | "searching"
  | "queued"
  | "driver_assigned"
  | "driver_on_way"
  | "driver_arrived"
  | "completed"
  | "timeout";

export default function Customer() {
  const [mode, setMode] = useState<RideMode>("normal");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [showRideForm, setShowRideForm] = useState(false);
  const [status, setStatus] = useState<RideStatus>("idle");
  const [driver, setDriver] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentZone, setCurrentZone] = useState("Zone 1 - Douala");

  const [walletBalance] = useState("2,500 CFA");

  const { profile, setProfile, logout } = useProfile();
  const [mapLocation, setMapLocation] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const updateProfileStatus = (newStatus: NonNullable<typeof profile>['status']) => {
    if (!profile) return;
    const updated = { ...profile, status: newStatus };
    setProfile(updated);
  };

  const showMap = (location: string | null) => {
    if (!location) return;
    setMapLocation(location);
    setMapVisible(true);
  };

  const requestRide = () => {
    if (mode === "cheap") {
      setStatus("queued");

      setTimeout(() => {
        const found = Math.random() > 0.4;

        if (!found) {
          setStatus("timeout");
        } else {
          setDriver({
            name: "Samuel Moto",
            bike: "TVS HLX",
            plate: "CM-884-YA",
          });
          setStatus("driver_assigned");

          setTimeout(() => setStatus("driver_on_way"), 2500);
          setTimeout(() => setStatus("driver_arrived"), 5500);
        }
      }, 4000);

      return;
    }

    // Normal ride flow
    setStatus("searching");

    setTimeout(() => {
      setDriver({
        name: "Jean Moto",
        bike: "Bajaj Boxer",
        plate: "LT-239-CM",
      });
      setStatus("driver_assigned");

      setTimeout(() => setStatus("driver_on_way"), 2000);
      setTimeout(() => setStatus("driver_arrived"), 5000);
    }, 3000);
  };

  const completeRide = () => setStatus("completed");

  const handleOpenRideRequest = () => {
    if (status === "idle") {
      // Show ride request form and preview map/price
      setShowRideForm(true);
      // scroll to form for smaller screens
      setTimeout(() => {
        const element = document.querySelector(".ride-request-form");
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  if (status !== "idle") {
    return (
      <div className="customer customer-ride-active">
        {/* Ride Request Modal */}
        {status === "searching" && (
          <div className="ride-card loading">
            <div className="spinner"></div>
            <p>Searching for drivers…</p>
          </div>
        )}

        {status === "queued" && (
          <div className="ride-card loading">
            <div className="spinner"></div>
            <p>Waiting for a passing-by driver…</p>
          </div>
        )}

        {status === "driver_assigned" && driver && (
          <div className="ride-card success">
            <h2>Driver Assigned</h2>
            <p>
              <strong>{driver.name}</strong>
            </p>
            <p>{driver.bike}</p>
            <p>{driver.plate}</p>
            <div className="ride-actions">
              <button className="secondary" onClick={() => showMap(pickup)} disabled={!pickup}>
                View Pickup on Map
              </button>
            </div>
          </div>
        )}

        {status === "driver_on_way" && (
          <div className="ride-card info">
            <h2>Driver On the Way</h2>
            <div className="ride-actions">
              <button className="secondary" onClick={() => showMap(pickup)} disabled={!pickup}>
                View Pickup on Map
              </button>
            </div>
          </div>
        )}

        {status === "driver_arrived" && (
          <div className="ride-card info">
            <h2>Driver Arrived</h2>
            <button className="primary" onClick={completeRide}>
              Start & Complete Ride
            </button>
            <div className="ride-actions">
              <button className="secondary" onClick={() => showMap(pickup)} disabled={!pickup}>
                View Pickup on Map
              </button>
            </div>
          </div>
        )}

        {status === "timeout" && (
          <div className="ride-card warning">
            <h2>No Driver Found</h2>
            <p>No passing driver matched your route.</p>
            <button onClick={() => setStatus("idle")}>Try Again</button>
          </div>
        )}

        {status === "completed" && (
          <div className="ride-card completed">
            <h2>Ride Completed</h2>
            <p>
              Final Fare:{" "}
              <strong>
                {mode === "normal" ? "1,650 FCFA" : "950 FCFA"}
              </strong>
            </p>
            <button onClick={() => setStatus("idle")}>
              Book Another Ride
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="customer">
      {/* TOP HEADER AREA */}
      <div className="customer-header">
        <div className="header-left">
          <div className="greeting">Good morning, {profile?.name}! 👋</div>
          <div className="zone-and-logout">
            <div className="zone-selector">
              <span className="zone-label">📍</span>
              <select
              value={currentZone}
              onChange={(e) => setCurrentZone(e.target.value)}
              className="zone-dropdown"
              title="Select zone or city"
            >
              <option>Zone 1 - Douala</option>
              <option>Zone 2 - Akwa</option>
              <option>Zone 3 - Bonamoussadi</option>
              <option>Zone 4 - Deido</option>
            </select>
          </div>
            <button className="btn btn-ghost" onClick={handleLogout} title="Logout">🚪 Logout</button>
        </div>
        <button
          className="profile-icon"
          onClick={() => setShowProfile(!showProfile)}
          title="Profile"
        >
          👤
        </button>
      </div>

      {/* PROFILE POPUP */}
      {showProfile && (
        <div className="profile-popup">
          <div className="profile-content">
            <h3>{profile?.name ?? "Guest"}</h3>
            <p className="profile-status">
              Status: {" "}
              <strong>
                {profile?.status === "student"
                  ? "🎓 Student"
                  : profile?.status === "worker"
                  ? "💼 Worker"
                  : "🙂 Member"}
              </strong>
            </p>
            {profile?.discount && (
              <p className="profile-discount">
                Active Discount: <strong>−{profile.discount}%</strong>
              </p>
            )}
            <div className="profile-actions">
              <button className="secondary">Settings</button>
              <button className="secondary">Preferences</button>
              {profile?.status !== "worker" && (
                <button className="secondary" onClick={() => updateProfileStatus("worker")}>
                  Switch to Worker
                </button>
              )}
              {profile?.status !== "student" && (
                <button className="secondary" onClick={() => updateProfileStatus("student")}>
                  Switch to Student
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CENTRAL ACTION SECTION */}
      <div className="action-section">
        <button
          className="primary-action"
          onClick={handleOpenRideRequest}
        >
          <div className="action-icon">🚗</div>
          <div className="action-text">
            <div className="action-title">Where do you go?</div>
            <div className="action-subtitle">Request a ride now</div>
          </div>
        </button>

        <button
          className="secondary-action"
          onClick={handleOpenRideRequest}
        >
          <div className="action-icon">⏱️</div>
          <div className="action-text">
            <div className="action-title">Cheap ride</div>
            <div className="action-subtitle">Wait and pay less</div>
          </div>
        </button>
      </div>

      {/* SERVICE CARDS */}
      <div className="service-cards">
        <button
          className="service-card"
          onClick={() => navigate("/customer/shops")}
        >
          <div className="card-icon">🛒</div>
          <div className="card-content">
            <div className="card-title">Order from shops</div>
            <div className="card-subtitle">
              Buy from nearby partner shops
            </div>
          </div>
        </button>

        <button className="service-card">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <div className="card-title">Wallet & plans</div>
            <div className="card-subtitle">
              Manage payments & monthly plan
            </div>
          </div>
        </button>
      </div>

      {/* MINI MAP */}
      <div className="mini-map-section">
        <div className="mini-map">
          <div className="map-placeholder">
            <div className="map-location-marker">📍</div>
            <div className="map-moto-icon map-moto-1">🏍️</div>
            <div className="map-moto-icon map-moto-2">🏍️</div>
          </div>
        </div>
        <div className="mini-map-info">
          Current location · 2 nearby motos available
        </div>
      </div>

      {/* WALLET & OFFERS STRIP */}
      <div className="wallet-strip">
        <div className="wallet-item">
          <span className="wallet-label">Wallet Balance</span>
          <span className="wallet-amount">{walletBalance}</span>
        </div>
        <button className="wallet-action">+ Add money</button>
      </div>

      {/* DISCOUNT/STATUS STRIP */}
      {profile?.discount !== undefined && profile.discount > 0 && (
        <div className="discount-strip">
          <span className="discount-badge">✨</span>
          <span className="discount-text">
            {profile.status === "student"
              ? `Student: −${profile.discount}% on school rides`
              : profile.status === "worker"
              ? `Worker perk: −${profile.discount}% on commute rides`
              : `Member: −${profile.discount}%`}
          </span>
        </div>
      )}

      {/* PROMOTIONS BANNER */}
      <div className="promotions-banner">
        <div className="banner-content">
          <div className="banner-icon">🎉</div>
          <div className="banner-text">
            <div className="banner-title">Plan your month</div>
            <div className="banner-subtitle">
              Get unlimited rides with monthly plan
            </div>
          </div>
        </div>
      </div>

      {/* RIDE REQUEST FORM - toggled by state */}
      <div className={`ride-request-form ${showRideForm ? "" : "ride-form-hidden"}`}>
        <div className="form-overlay" onClick={() => setShowRideForm(false)}></div>
        <div className="ride-card">
          <button
            className="close-btn"
            onClick={() => setShowRideForm(false)}
          >
            ✕
          </button>

          <h2>Request a Ride</h2>

          {/* Ride Mode Selector */}
          <div className="ride-type-toggle">
            <button
              className={mode === "normal" ? "active" : ""}
              onClick={() => setMode("normal")}
            >
              Ride Now
            </button>
            <button
              className={mode === "cheap" ? "active" : ""}
              onClick={() => setMode("cheap")}
            >
              Cheap Ride
            </button>
          </div>

          <input
            type="text"
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />

          <button className="map-preview" onClick={() => showMap(pickup)} disabled={!pickup}>
            📍 Preview Pickup on Map
          </button>

          <input
            type="text"
            placeholder="Drop-off location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />

          <div className="estimate">
            <span>
              Price: {" "}
              <strong>
                {pickup && dropoff
                  ? mode === "normal"
                    ? "1,500 FCFA"
                    : "1,000 FCFA"
                  : "--"}
              </strong>
            </span>
            <span>
              ETA: {" "}
              <strong>
                {pickup && dropoff
                  ? mode === "normal"
                    ? "5 mins"
                    : "10–15 mins"
                  : "--"}
              </strong>
            </span>
          </div>

          {mode === "cheap" && (
            <p className="cheap-note">
              You may wait longer for a driver already passing your route.
            </p>
          )}

          {/* Small embedded map inside the request card to preview pickup */}
          <div className="ride-map">
            {pickup ? (
              <iframe
                title={`ride-map-${pickup}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(pickup)}&output=embed`}
                width="100%"
                height="160"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="ride-map-placeholder">Enter a pickup to preview the map</div>
            )}
          </div>

          <button
            className="primary"
            disabled={!pickup || !dropoff}
            onClick={() => {
              setShowRideForm(false);
              requestRide();
            }}
          >
            Confirm {mode === "normal" ? "Ride" : "Cheap Ride"}
          </button>
        </div>
      </div>

      <MapModal visible={mapVisible} locationName={mapLocation} onClose={() => setMapVisible(false)} />
    </div>
    </div>
  );
}
