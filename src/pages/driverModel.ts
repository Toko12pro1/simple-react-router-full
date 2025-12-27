export type OfferType = "ride" | "cheap" | "parcel";

export interface OfferData {
  id: string;
  type: OfferType;
  pickup: string;
  dropoff: string;
  fare: number;
  distanceToPickup: string;
  note?: string;
}

export function randomId(prefix = "o") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class Offer implements OfferData {
  id: string;
  type: OfferType;
  pickup: string;
  dropoff: string;
  fare: number;
  distanceToPickup: string;
  note?: string;

  constructor(data: OfferData) {
    this.id = data.id;
    this.type = data.type;
    this.pickup = data.pickup;
    this.dropoff = data.dropoff;
    this.fare = data.fare;
    this.distanceToPickup = data.distanceToPickup;
    this.note = data.note;
  }

  static random(): Offer {
    const types: OfferType[] = ["ride", "cheap", "parcel"];
    const t = types[Math.floor(Math.random() * types.length)];
    const fareBase = t === "cheap" ? 800 : t === "parcel" ? 1200 : 1500;
    const data: OfferData = {
      id: randomId("offer"),
      type: t,
      pickup: ["Market", "Station", "Mall", "School"][Math.floor(Math.random() * 4)] + " Zone",
      dropoff: ["Airport", "Center", "Harbor", "Clinic"][Math.floor(Math.random() * 4)],
      fare: fareBase + Math.floor(Math.random() * 800),
      distanceToPickup: `${Math.floor(1 + Math.random() * 6)} km`,
      note: t === "parcel" ? "Small parcel" : undefined,
    };
    return new Offer(data);
  }
}

export type JobStatus = "assigned" | "on_way" | "arrived" | "started" | "completed" | "cancelled";

export class Job extends Offer {
  status: JobStatus;

  constructor(offer: Offer, status: JobStatus = "assigned") {
    super(offer);
    this.status = status;
  }

  updateStatus(status: JobStatus) {
    this.status = status;
    return this;
  }

  isActive() {
    return this.status !== "completed" && this.status !== "cancelled";
  }
}
