import React from "react";
import { navigate } from "../router";
import "./EarningsStrip.css";

type Props = {
  earnings: { today: number; week: number; month: number };
};

export default function EarningsStrip({ earnings }: Props) {
  return (
    <div className="earnings-strip card">
      <div>
        <div className="small-muted">Today</div>
        <div className="earn-amount">₦{earnings.today.toLocaleString()}</div>
      </div>
      <div>
        <div className="small-muted">This week</div>
        <div className="earn-amount">₦{earnings.week.toLocaleString()}</div>
      </div>
      <div>
        <div className="small-muted">This month</div>
        <div className="earn-amount">₦{earnings.month.toLocaleString()}</div>
      </div>
      <div>
        <button className="secondary" onClick={() => navigate("/driver/earnings")}>View details</button>
      </div>
    </div>
  );
}
