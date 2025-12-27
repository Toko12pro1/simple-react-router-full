import React from "react";
import "./DriverStatus.css";

export default function DriverStatus() {
  const status = "Pending" as "Pending" | "Action Required" | "Rejected"; // replace with backend value

  return (
    <div className="driver-status">
      <h1>Driver Verification</h1>

      {status === "Pending" && (
        <p>Your account is under review. Please wait for admin approval.</p>
      )}

      {status === "Action Required" && (
        <>
          <p>Some documents were rejected.</p>
          <button>Re-upload Documents</button>
        </>
      )}

      {status === "Rejected" && (
        <p>Your application was rejected. Contact support.</p>
      )}
    </div>
  );
}
