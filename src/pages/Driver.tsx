import React, { useEffect, useState } from "react";
import { navigate } from "../router";
import { useProfile } from "../contexts/ProfileContext";
import "./Driver.css";
import { Offer, Job } from "./driverModel";
import DriverHeader from "./DriverHeader";
import OfferCard from "./OfferCard";
import ActiveJobCard from "./ActiveJobCard";
import EarningsStrip from "./EarningsStrip";
import MapModal from "../components/MapModal";

export default function Driver() {
  const { logout } = useProfile();
  const [approved] = useState(true);
  const [online, setOnline] = useState(false);
  const [currentZone, setCurrentZone] = useState("Zone 1 - Douala");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [earnings, setEarnings] = useState({ today: 4200, week: 18200, month: 62400 });
  const [pickupCountdown, setPickupCountdown] = useState<number | null>(null);
  const [mapLocation, setMapLocation] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // incoming offers generator
  useEffect(() => {
    if (!online) return;
    const interval = setInterval(() => {
      setOffers((prev) => {
        if (activeJob) return prev;
        if (prev.length >= 3) return prev;
        return [...prev, Offer.random()];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [online, activeJob]);

  // pickup countdown
  useEffect(() => {
    if (pickupCountdown === null) return;
    if (pickupCountdown <= 0) {
      setPickupCountdown(null);
      if (activeJob && activeJob.status === "arrived") {
        setActiveJob((j) => (j ? j.updateStatus("cancelled") : j));
      }
      return;
    }
    const t = window.setTimeout(() => setPickupCountdown((s) => (s !== null ? s - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [pickupCountdown, activeJob]);

  if (!approved) {
    return (
      <div className="driver">
        <h1>Access Restricted</h1>
        <p>Your account is not yet approved.</p>
      </div>
    );
  }

  const toggleOnline = () => {
    setOnline((v) => {
      if (v) setOffers([]);
      return !v;
    });
  };

  const acceptOffer = (id: string) => {
    const o = offers.find((x) => x.id === id);
    if (!o) return;
    setActiveJob(new Job(o));
    setOffers([]);
  };

  const handleShowMap = (location: string) => {
    setMapLocation(location);
    setMapVisible(true);
  };

  const rejectOffer = (id: string) => setOffers((p) => p.filter((x) => x.id !== id));

  const updateJobStatus = (status: any) => {
    if (!activeJob) return;
    const updated = activeJob.updateStatus(status);
    setActiveJob(new Job(updated, updated.status));

    if (status === "arrived") setPickupCountdown(90);
    if (status !== "arrived") setPickupCountdown(null);

    if (status === "completed") {
      setEarnings((e) => ({ ...e, today: e.today + activeJob.fare }));
      setTimeout(() => setActiveJob(null), 1200);
    }

    if (status === "cancelled") setTimeout(() => setActiveJob(null), 800);
  };

  return (
    <div className="driver">
      <DriverHeader online={online} onToggleOnline={toggleOnline} currentZone={currentZone} onZoneChange={setCurrentZone} />
      
      <div className="logout-container">
        <button className="btn btn-ghost" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {activeJob ? (
        <ActiveJobCard job={activeJob} onUpdateStatus={updateJobStatus} pickupCountdown={pickupCountdown} onShowMap={handleShowMap} />
      ) : (
        <div className="offers-area">
          <h2>Incoming Offers</h2>
          <div className="offers-list">
            {offers.length === 0 && <div className="muted">No offers yet — go online to receive offers.</div>}
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o} onAccept={acceptOffer} onReject={rejectOffer} onShowMap={handleShowMap} />
            ))}
          </div>
        </div>
      )}

      <EarningsStrip earnings={earnings} />

      <MapModal visible={mapVisible} locationName={mapLocation} onClose={() => setMapVisible(false)} />
    </div>
  );
}