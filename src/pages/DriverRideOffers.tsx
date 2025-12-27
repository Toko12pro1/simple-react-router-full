import React, { useState } from "react";
import "./DriverRideOffers.css";

type OfferType = "normal" | "cheap";

interface RideOffer {
  id: number;
  type: OfferType;
  pickup: string;
  dropoff: string;
  price: string;
  eta: string;
}

export default function DriverRideOffers() {
  const [offers, setOffers] = useState<RideOffer[]>([
    {
      id: 1,
      type: "normal",
      pickup: "Bonamoussadi",
      dropoff: "Akwa",
      price: "1,600 FCFA",
      eta: "5 mins",
    },
    {
      id: 2,
      type: "cheap",
      pickup: "Makepe",
      dropoff: "Deido",
      price: "1,000 FCFA",
      eta: "Flexible",
    },
  ]);

  const acceptOffer = (id: number) => {
    alert(`Offer ${id} accepted`);
    setOffers(offers.filter((o) => o.id !== id));
  };

  const rejectOffer = (id: number) => {
    setOffers(offers.filter((o) => o.id !== id));
  };

  return (
    <div className="driver-offers">
      <h1>Ride Offers</h1>

      {offers.map((offer) => (
        <div key={offer.id} className={`offer-card ${offer.type}`}>
          <h3>{offer.type === "normal" ? "Normal Ride" : "Cheap Ride"}</h3>
          <p>Pickup: {offer.pickup}</p>
          <p>Drop-off: {offer.dropoff}</p>
          <p>Fare: <strong>{offer.price}</strong></p>
          <p>ETA: {offer.eta}</p>

          <div className="actions">
            <button onClick={() => acceptOffer(offer.id)}>Accept</button>
            <button className="reject" onClick={() => rejectOffer(offer.id)}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
