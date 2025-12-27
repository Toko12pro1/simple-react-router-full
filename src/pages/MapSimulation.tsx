import React, { useState } from "react";
import "./MapSimulation.css";

export default function MapSimulation() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  return (
    <div className="map-page">
      <h1>Map Simulation</h1>

      <div className="map-box">
        <p>🗺 Map Placeholder</p>
        <p>Pickup: {pickup || "--"}</p>
        <p>Drop-off: {dropoff || "--"}</p>
      </div>

      <input
        placeholder="Set pickup"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />

      <input
        placeholder="Set drop-off"
        value={dropoff}
        onChange={(e) => setDropoff(e.target.value)}
      />
    </div>
  );
}
