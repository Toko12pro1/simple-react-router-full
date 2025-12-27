import React from "react";

type Props = {
  visible: boolean;
  locationName: string | null;
  onClose: () => void;
};

export default function MapModal({ visible, locationName, onClose }: Props) {
  if (!visible || !locationName) return null;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(locationName)}&output=embed`;

  return (
    <div className="map-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="map-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <div className="map-modal-header-title">
              <h3 className="page-title">Map preview</h3>
              <div className="muted">{locationName}</div>
            </div>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close map preview">✕</button>
        </header>

        <div className="map-embed">
          <iframe
            title={`map-${locationName}`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="map-modal-footer">
          <a className="btn btn-ghost" href={mapsHref} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
