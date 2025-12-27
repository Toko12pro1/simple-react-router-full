import React, { useState, useContext } from "react";
import { navigate } from "../../router";
import { shops, categories, ShopCategory, CartItem } from "./shopsData";
import type { ShopsContextType } from "./ShopsContext";
import { ShopsContext } from "./ShopsContext";
import "./ShopsHome.css";

export default function ShopsHome() {
  const context = useContext(ShopsContext) as ShopsContextType | null;
  const cartItems = context?.cartItems || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | "all">("all");

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || shop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = (cartItems as CartItem[]).reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = (cartItems as CartItem[]).reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="shops-home">
      {/* HEADER */}
      <div className="shops-header">
        <button className="back-btn" onClick={() => navigate("/customer")}>
          ← Back
        </button>
        <h1>Shop Market</h1>
        <div className="header-spacer"></div>
      </div>

      {/* SEARCH BAR */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search shop or product"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CATEGORY FILTERS */}
      <div className="category-filters">
        <button
          className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SHOPS LIST */}
      <div className="shops-list">
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => (
            <button
              key={shop.id}
              className="shop-card"
              onClick={() => navigate(`/customer/shops/${shop.id}`)}
            >
              <div className="shop-logo">{shop.logo}</div>
              <div className="shop-info">
                <div className="shop-name">{shop.name}</div>
                <div className="shop-category">{shop.category}</div>
                <div className="shop-meta">
                  {shop.distance} · {shop.zone}
                </div>
                <div className="shop-status">
                  {shop.status === "open" ? (
                    <span className="status-open">
                      ✓ Open until {shop.closingTime}
                    </span>
                  ) : (
                    <span className="status-closed">✕ Closed</span>
                  )}
                </div>
              </div>
              <div className="shop-rating">⭐ {shop.rating}</div>
            </button>
          ))
        ) : (
          <div className="no-results">
            <p>No shops found matching your search.</p>
          </div>
        )}
      </div>

      {/* FLOATING CART */}
      {totalItems > 0 && (
        <button
          className="floating-cart"
          onClick={() => navigate("/customer/shops/cart")}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-items">{totalItems}</span>
          <span className="cart-price">{totalPrice.toLocaleString()} CFA</span>
        </button>
      )}
    </div>
  );
}
