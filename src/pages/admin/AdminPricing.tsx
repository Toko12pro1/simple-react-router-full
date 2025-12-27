import React, { useEffect, useState } from "react";
import { adminController, FareRule, Promotion } from "./AdminController";

export default function AdminPricing() {
  const [fareRules, setFareRules] = useState<FareRule | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editingFares, setEditingFares] = useState(false);
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [editRules, setEditRules] = useState<FareRule | null>(null);
  const [newPromo, setNewPromo] = useState({
    name: "",
    description: "",
    discount: 0,
    applicableTo: [] as ("student" | "worker" | "regular")[],
    active: true,
  });

  useEffect(() => {
    const unsubscribe = adminController.subscribe((state) => {
      setFareRules(state.fareRules);
      setPromotions(state.promotions);
      setEditRules(state.fareRules);
    });
    return unsubscribe;
  }, []);

  const handleSaveFareRules = () => {
    if (editRules) {
      adminController.updateFareRules(editRules);
      setEditingFares(false);
    }
  };

  const handleAddPromotion = () => {
    if (!newPromo.name || !newPromo.description || newPromo.discount <= 0 || newPromo.applicableTo.length === 0) {
      alert("Please fill all promotion fields and select at least one category");
      return;
    }
    adminController.addPromotion({
      name: newPromo.name,
      description: newPromo.description,
      discount: newPromo.discount,
      applicableTo: newPromo.applicableTo,
      active: newPromo.active,
    });
    setNewPromo({ name: "", description: "", discount: 0, applicableTo: [], active: true });
    setShowAddPromo(false);
  };

  const handleTogglePromotion = (id: string, active: boolean) => {
    adminController.updatePromotion(id, { active: !active });
  };

  const handleDeletePromotion = (id: string) => {
    adminController.deletePromotion(id);
  };

  const handleCategoryToggle = (category: "student" | "worker" | "regular") => {
    setNewPromo({
      ...newPromo,
      applicableTo: newPromo.applicableTo.includes(category)
        ? newPromo.applicableTo.filter((c) => c !== category)
        : [...newPromo.applicableTo, category],
    });
  };

  const handleCategoryToggleEdit = (category: "student" | "worker" | "regular", promotionId: string) => {
    const promo = promotions.find((p) => p.id === promotionId);
    if (promo) {
      const newApplicableTo = promo.applicableTo.includes(category)
        ? promo.applicableTo.filter((c) => c !== category)
        : [...promo.applicableTo, category];
      adminController.updatePromotion(promotionId, { applicableTo: newApplicableTo });
    }
  };

  return (
    <div className="container">
      <div className="card admin-pricing">
        <div className="page-header">
          <h2 className="page-title">Pricing & Promotions</h2>
          <div className="controls">
            <button className="btn btn-ghost" onClick={() => setEditingFares(!editingFares)}>{editingFares ? "Cancel" : "✎ Edit Fares"}</button>
            <button className="btn btn-primary" onClick={() => setShowAddPromo(!showAddPromo)}>{showAddPromo ? "Cancel" : "+ Add Promotion"}</button>
          </div>
        </div>

        {/* Fare Rules Section */}
        <div className="pricing-section">
        {editingFares && editRules ? (
          <div className="fare-form">
            <div className="form-group">
              <label>Base Fare (₦)</label>
              <input
                title="Base Fare"
                type="number"
                value={editRules.baseFare}
                onChange={(e) => setEditRules({ ...editRules, baseFare: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Per KM (₦)</label>
              <input
                title="Per KM"
                type="number"
                value={editRules.perKm}
                onChange={(e) => setEditRules({ ...editRules, perKm: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Per Minute (₦)</label>
              <input
                title="Per Minute"
                type="number"
                value={editRules.perMinute}
                onChange={(e) => setEditRules({ ...editRules, perMinute: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Student Discount (%)</label>
              <input
                title="Student Discount"
                type="number"
                value={editRules.studentDiscount}
                onChange={(e) => setEditRules({ ...editRules, studentDiscount: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Worker Discount (%)</label>
              <input
                title="Worker Discount"
                type="number"
                value={editRules.workerDiscount}
                onChange={(e) => setEditRules({ ...editRules, workerDiscount: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Grace Period (minutes)</label>
              <input
                title="Grace Period"
                type="number"
                value={editRules.gracePeriod}
                onChange={(e) => setEditRules({ ...editRules, gracePeriod: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>No-Show Penalty (₦)</label>
              <input
                title="No-Show Penalty"
                type="number"
                value={editRules.noShowPenalty}
                onChange={(e) => setEditRules({ ...editRules, noShowPenalty: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Max Detour Percentage (%)</label>
              <input
                title="Max Detour Percentage"
                type="number"
                value={editRules.maxDetourPercentage}
                onChange={(e) => setEditRules({ ...editRules, maxDetourPercentage: parseInt(e.target.value) })}
              />
            </div>

            <button className="btn-save" onClick={handleSaveFareRules}>
              ✓ Save Changes
            </button>
          </div>
        ) : (
          fareRules && (
            <div className="fare-display">
              <div className="fare-card">
                <h4>Base Pricing</h4>
                <p>Base Fare: <strong>₦{fareRules.baseFare}</strong></p>
                <p>Per KM: <strong>₦{fareRules.perKm}</strong></p>
                <p>Per Minute: <strong>₦{fareRules.perMinute}</strong></p>
              </div>

              <div className="fare-card">
                <h4>Discounts</h4>
                <p>Student Discount: <strong>{fareRules.studentDiscount}%</strong></p>
                <p>Worker Discount: <strong>{fareRules.workerDiscount}%</strong></p>
              </div>

              <div className="fare-card">
                <h4>Rules & Penalties</h4>
                <p>Grace Period: <strong>{fareRules.gracePeriod} min</strong></p>
                <p>No-Show Penalty: <strong>₦{fareRules.noShowPenalty}</strong></p>
                <p>Max Detour: <strong>{fareRules.maxDetourPercentage}%</strong></p>
              </div>
            </div>
          )
        )}
        </div>

        {/* Promotions Section */}
        <div className="pricing-section">
          <div className="promo-section-header">
            <h3>🎉 Promotions & Offers</h3>
            <div className="controls">
              <button className="btn btn-ghost" onClick={() => setShowAddPromo(!showAddPromo)}>{showAddPromo ? "Cancel" : "+ Add Promotion"}</button>
            </div>
          </div>

        {showAddPromo && (
          <div className="promo-form">
            <div className="form-group">
              <label>Promotion Name</label>
              <input
                title="Promotion Name"
                type="text"
                placeholder="e.g., Student Summer Pack"
                value={newPromo.name}
                onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="e.g., 15% discount on all rides for students this month"
                value={newPromo.description}
                onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Discount (%)</label>
              <input
                title="Promotion Discount"
                type="number"
                min="0"
                max="100"
                value={newPromo.discount}
                onChange={(e) => setNewPromo({ ...newPromo, discount: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Applicable To</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newPromo.applicableTo.includes("student")}
                    onChange={() => handleCategoryToggle("student")}
                  />
                  👨‍🎓 Students
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={newPromo.applicableTo.includes("worker")}
                    onChange={() => handleCategoryToggle("worker")}
                  />
                  👨‍💼 Workers
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={newPromo.applicableTo.includes("regular")}
                    onChange={() => handleCategoryToggle("regular")}
                  />
                  👤 Regular Users
                </label>
              </div>
            </div>

            <button className="btn-save" onClick={handleAddPromotion}>
              ✓ Create Promotion
            </button>
          </div>
        )}

        <div className="promos-list">
          {promotions.length === 0 ? (
            <p className="empty-state">No promotions yet. Create your first promotion!</p>
          ) : (
            promotions.map((promo) => (
              <div key={promo.id} className="promo-card">
                <div className="promo-header">
                  <h4>{promo.name}</h4>
                  <span className={`promo-badge ${promo.active ? "active" : "inactive"}`}>
                    {promo.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="promo-desc">{promo.description}</p>
                <div className="promo-details">
                  <p>💰 Discount: <strong>{promo.discount}%</strong></p>
                  <p>📊 Used: <strong>{promo.usageCount} times</strong></p>
                  <p>📅 Created: {new Date(promo.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="promo-categories">
                  {["student", "worker", "regular"].map((cat) => (
                    <label key={cat}>
                      <input
                        type="checkbox"
                        checked={promo.applicableTo.includes(cat as any)}
                        onChange={() => handleCategoryToggleEdit(cat as any, promo.id)}
                      />
                      {cat === "student" ? "👨‍🎓 Students" : cat === "worker" ? "👨‍💼 Workers" : "👤 Regular"}
                    </label>
                  ))}
                </div>
                <div className="promo-actions">
                  <button
                    className={`btn-action ${promo.active ? "btn-deactivate" : "btn-activate"}`}
                    onClick={() => handleTogglePromotion(promo.id, promo.active)}
                  >
                    {promo.active ? "Deactivate" : "Activate"}
                  </button>
                  <button className="btn-action btn-delete" onClick={() => handleDeletePromotion(promo.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
