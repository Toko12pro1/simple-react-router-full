import React, { useState, useContext } from "react";
import { navigate } from "../../router";
import { shops } from "./shopsData";
import { ShopsContext } from "./ShopsContext";
import "./ShopDetail.css";

interface ShopDetailProps {
  shopId?: string;
}

export default function ShopDetail({ shopId }: ShopDetailProps) {
  const { cartItems, addToCart } = useContext(ShopsContext);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const shop = shops.find((s) => s.id === shopId);

  if (!shop) {
    return (
      <div className="shop-detail error">
        <h2>Shop not found</h2>
        <button onClick={() => navigate("/customer/shops")}>← Back to Shops</button>
      </div>
    );
  }

  const categories = Array.from(
    new Set(shop.products.map((p) => p.category))
  );
  const displayedCategory = selectedCategory || categories[0];
  const filteredProducts = shop.products.filter(
    (p) => p.category === displayedCategory
  );

  const handleAddToCart = (product: any, quantity: number) => {
    if (quantity > 0) {
      addToCart({
        productId: product.id,
        shopId: shop.id,
        name: product.name,
        price: product.price,
        quantity,
      });
      setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    }
  };

  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="shop-detail">
      {/* HEADER */}
      <div className="shop-detail-header">
        <button className="back-btn" onClick={() => navigate("/customer/shops")}>
          ← Back
        </button>
        <h1 className="shop-title">Shop Details</h1>
        <div className="header-spacer"></div>
      </div>

      {/* SHOP INFO */}
      <div className="shop-header-card">
        <div className="shop-header-logo">{shop.logo}</div>
        <div className="shop-header-info">
          <h2>{shop.name}</h2>
          <p className="shop-category-large">{shop.category}</p>
          <div className="shop-details-meta">
            <span>{shop.distance}</span>
            <span>·</span>
            <span>{shop.zone}</span>
            <span>·</span>
            <span>⭐ {shop.rating}</span>
          </div>
          <div className="shop-status-large">
            {shop.status === "open" ? (
              <span className="status-open">Open until {shop.closingTime}</span>
            ) : (
              <span className="status-closed">Closed</span>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      {categories.length > 1 && (
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${selectedCategory === cat || (selectedCategory === null && cat === categories[0]) ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* PRODUCTS LIST */}
      <div className="products-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <div className="product-info">
              <h3>{product.name}</h3>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              <div className="product-price">{product.price.toLocaleString()} CFA</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [product.id]: Math.max(0, (prev[product.id] || 0) - 1),
                    }))
                  }
                >
                  −
                </button>
                <span className="qty-display">{quantities[product.id] || 0}</span>
                <button
                  className="qty-btn"
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [product.id]: (prev[product.id] || 0) + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
              <button
                className="add-btn"
                onClick={() =>
                  handleAddToCart(product, quantities[product.id] || 0)
                }
                disabled={(quantities[product.id] || 0) === 0}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* STICKY CART PREVIEW */}
      {getTotalItems() > 0 && (
        <div className="cart-preview-sticky">
          <div className="cart-preview-info">
            <span>{getTotalItems()} items</span>
            <span>·</span>
            <span className="cart-total">
              {getTotalPrice().toLocaleString()} CFA
            </span>
          </div>
          <button
            className="view-cart-btn"
            onClick={() => navigate("/customer/shops/cart")}
          >
            View Cart →
          </button>
        </div>
      )}
    </div>
  );
}
