import React, { useContext, useState } from "react";
import { navigate } from "../../router";
import { ShopsContext } from "./ShopsContext";
import "./ShopsCart.css";

export default function ShopsCart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useContext(ShopsContext);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 500 : 0;
  const discount = subtotal > 10000 ? Math.floor(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee - discount;

  const handleCheckout = () => {
    if (!deliveryAddress) {
      alert("Please enter a delivery address");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="cart-success">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Order Confirmed!</h2>
          <p>Your order has been placed successfully.</p>
          <p className="order-details">Estimated delivery: 30-45 minutes</p>
          <button
            className="primary-btn"
            onClick={() => navigate("/customer/shops")}
          >
            Continue Shopping
          </button>
          <button
            className="secondary-btn"
            onClick={() => navigate("/customer")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="cart-empty">
        <div className="empty-card">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add items from shops to get started</p>
          <button
            className="primary-btn"
            onClick={() => navigate("/customer/shops")}
          >
            Browse Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shops-cart">
      {/* HEADER */}
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate("/customer/shops")}>
          ← Back
        </button>
        <h1>Your Cart</h1>
        <div className="header-spacer"></div>
      </div>

      {/* CART ITEMS */}
      <div className="cart-items-list">
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">
                {(item.price * item.quantity).toLocaleString()} CFA
              </p>
            </div>
            <div className="item-quantity">
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.productId)}
              title="Remove"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* PRICING BREAKDOWN */}
      <div className="pricing-section">
        <div className="price-row">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString()} CFA</span>
        </div>
        <div className="price-row">
          <span>Delivery Fee</span>
          <span>{deliveryFee.toLocaleString()} CFA</span>
        </div>
        {discount > 0 && (
          <div className="price-row discount">
            <span>Discount (5%)</span>
            <span>−{discount.toLocaleString()} CFA</span>
          </div>
        )}
        <div className="price-row total">
          <span>Total</span>
          <span>{total.toLocaleString()} CFA</span>
        </div>
      </div>

      {/* DELIVERY ADDRESS */}
      <div className="form-section">
        <label>Delivery Address</label>
        <input
          type="text"
          placeholder="Enter delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="form-input"
        />
        <button className="map-btn">📍 Use Current Location</button>
      </div>

      {/* PAYMENT METHOD */}
      <div className="form-section">
        <label>Payment Method</label>
        <div className="payment-options">
          <button
            className={`payment-option ${paymentMethod === "wallet" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("wallet")}
          >
            <span className="payment-icon">💳</span>
            <span>Wallet</span>
            <span className="payment-badge">Default</span>
          </button>
          <button
            className={`payment-option ${paymentMethod === "cash" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("cash")}
          >
            <span className="payment-icon">💵</span>
            <span>Cash on Delivery</span>
          </button>
        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      <div className="checkout-section">
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={isProcessing || cartItems.length === 0}
        >
          {isProcessing ? (
            <>
              <span className="spinner-small"></span> Processing...
            </>
          ) : (
            `Order Now (${total.toLocaleString()} CFA)`
          )}
        </button>
      </div>
    </div>
  );
}
