import React from "react";
import type { Job as JobModel, JobStatus } from "./driverModel";
import "./ActiveJobCard.css";

type Props = {
  job: JobModel;
  onUpdateStatus: (status: JobStatus) => void;
  pickupCountdown: number | null;
  onShowMap?: (location: string) => void;
};

export default function ActiveJobCard({ job, onUpdateStatus, pickupCountdown, onShowMap }: Props) {
  return (
    <div className="active-job card">
      <div className="job-header">
        <div>
          <h2 className="job-title">{job.type === "parcel" ? "Parcel Delivery" : "Ride"}</h2>
          <div className="small-muted">{job.pickup} → {job.dropoff}</div>
        </div>
        <div className="job-fare">
          <div className="fare-amount">₦{job.fare.toLocaleString()}</div>
          <div className="muted">{job.distanceToPickup}</div>
        </div>
      </div>

      <div className="job-actions-container">
        {job.status === "assigned" && (
          <>
            <button className="primary" onClick={() => { window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.pickup)}`, '_blank'); }}>Navigate</button>
            <button className="secondary" onClick={() => onShowMap && onShowMap(job.pickup)}>Map</button>
            <button className="secondary" onClick={() => onUpdateStatus("cancelled")}>Reject</button>
          </>
        )}

        {job.status === "on_way" && (
          <button className="primary" onClick={() => onUpdateStatus("arrived")}>Arrived</button>
        )}

        {job.status === "arrived" && (
          <>
            <div className="pickup-countdown">No-show in: {pickupCountdown}s</div>
            <button className="primary" onClick={() => onUpdateStatus("started")}>Start Trip</button>
            <button className="secondary" onClick={() => onUpdateStatus("cancelled")}>No-show</button>
          </>
        )}

        {job.status === "started" && (
          <button className="primary" onClick={() => onUpdateStatus("completed")}>Complete</button>
        )}

        {job.status === "cancelled" && <div className="muted">Job cancelled</div>}
      </div>
    </div>
  );
}
