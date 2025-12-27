import React from "react";
import "./AdminLiveRides.css";

export default function AdminLiveRides() {
  const rides = [
    {
      id: 101,
      user: "Alice",
      driver: "Jean Moto",
      status: "Driver on the way",
      type: "Normal",
    },
    {
      id: 102,
      user: "Paul",
      driver: "Samuel Moto",
      status: "Queued (Cheap Ride)",
      type: "Cheap",
    },
  ];

  return (
    <div className="admin-rides">
      <h1>Live Rides</h1>

      <table>
        <thead>
          <tr>
            <th>Ride ID</th>
            <th>User</th>
            <th>Driver</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user}</td>
              <td>{r.driver}</td>
              <td>{r.type}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
