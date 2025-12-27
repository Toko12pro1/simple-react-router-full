import React from "react";
import "./DriverHeader.css";

type Props = {
  online: boolean;
  onToggleOnline: () => void;
  currentZone: string;
  onZoneChange: (z: string) => void;
};

export default function DriverHeader({ online, onToggleOnline, currentZone, onZoneChange }: Props) {
  return (
    <div className="driver-header card">
      <div className="header-left">
        <div className="header-info-container">
          <div className="avatar">DR</div>
          <div>
            <h1 className="driver-name">Daniel O.</h1>
            <div className="small-muted">Rating: ⭐ 4.8 · 120 trips</div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="zone-pill">
          <strong>{currentZone}</strong>
        </div>

        <div className="button-container">
          <button type="button" className={`online-toggle ${online ? "online" : "offline"}`} onClick={onToggleOnline} aria-pressed={online.toString()}>
            <span className="dot" />
            <span className="label">{online ? "Online" : "Offline"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
