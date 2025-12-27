import React from "react";
import type { Offer as OfferModel } from "./driverModel";

type Props = {
  offer: OfferModel;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onShowMap?: (location: string) => void;
};

export default function OfferCard({ offer, onAccept, onReject, onShowMap }: Props) {
  return (
    <div className={`offer-card ${offer.type}`}>
      <div className="offer-left">
        <div className="offer-header">
          <div className="offer-icon">{offer.type === 'parcel' ? '📦' : offer.type === 'cheap' ? '💸' : '🚗'}</div>
          <div>
            <div className="offer-type">{offer.type === 'cheap' ? 'Cheap Ride' : offer.type === 'parcel' ? 'Parcel' : 'Ride'}</div>
            <div className="offer-locations">
              <div>📍 {offer.pickup}</div>
              <div>➡️ {offer.dropoff}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="offer-right">
        <div className="offer-fare">₦{offer.fare.toLocaleString()}</div>
        <div className="offer-distance muted">{offer.distanceToPickup}</div>
        <div className="offer-actions">
          <button className="primary" onClick={() => onAccept(offer.id)}>Accept</button>
          <button className="secondary" onClick={() => onReject(offer.id)}>Reject</button>
        </div>
      </div>
    </div>
  );
}
