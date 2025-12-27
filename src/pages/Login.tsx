import React, { useState } from "react";
import { navigate } from "../router";
import { authAPI } from "../lib/auth";
import "./Login.css";

type AuthMode = "phone" | "otp" | "password";

export default function Login() {
  const [authMode, setAuthMode] = useState<AuthMode>("phone");
  const [showSignUp, setShowSignUp] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [signUpData, setSignUpData] = useState({
    phone: "",
    name: "",
    password: "",
    confirmPassword: "",
    user_type: "customer" as "customer" | "driver",
    profile_type: "regular" as "regular" | "student" | "worker" | "parent"
  });

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authAPI.sendOTP(phone);
      setOtpSent(true);
      setAuthMode("otp");
      if (result.dev_otp) {
        setDevOtp(result.dev_otp);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authAPI.verifyOTP(phone, otp);
      navigate(`/${result.user.user_type}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authAPI.login({ phone, password });
      navigate(`/${result.user.user_type}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authAPI.signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signUpData.phone || !signUpData.name || !signUpData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signUpData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.register({
        phone: signUpData.phone,
        name: signUpData.name,
        password: signUpData.password,
        user_type: signUpData.user_type,
        profile_type: signUpData.profile_type
      });

      navigate(`/${result.user.user_type}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Sign in to continue to MotoTaxi</p>

        {error && <div className="form-error">{error}</div>}

        {!otpSent ? (
          <form onSubmit={authMode === "password" ? handlePasswordLogin : handleSendOTP}>
            <div className="input-group">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder=" "
                required
                disabled={loading}
              />
              <label htmlFor="phone">Phone Number</label>
            </div>

            {authMode === "password" && (
              <div className="input-group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <label htmlFor="password">Password</label>
              </div>
            )}

            <button
              type="submit"
              className="btn-gradient"
              disabled={loading}
            >
              {loading ? "Please wait..." : authMode === "password" ? "Login" : "Send OTP"}
            </button>

            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <button
                type="button"
                className="signup-link"
                onClick={() => setAuthMode(authMode === "password" ? "phone" : "password")}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {authMode === "password" ? "Use OTP instead" : "Use password instead"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              Enter the OTP sent to {phone}
            </p>

            {devOtp && (
              <div style={{
                background: '#fff3cd',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                textAlign: 'center',
                color: '#856404'
              }}>
                Development OTP: <strong>{devOtp}</strong>
              </div>
            )}

            <div className="input-group">
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder=" "
                required
                disabled={loading}
                maxLength={6}
              />
              <label htmlFor="otp">Enter OTP</label>
            </div>

            <button
              type="submit"
              className="btn-gradient"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <button
                type="button"
                className="signup-link"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setDevOtp("");
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Change phone number
              </button>
            </div>
          </form>
        )}

        <button className="google-signin" onClick={handleGoogleSignIn}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Sign in with Google
        </button>

        <p className="signup-text">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => setShowSignUp(true)}>
            Sign up for free
          </span>
        </p>
      </div>

      {showSignUp && (
        <div className="modal-overlay" onClick={() => setShowSignUp(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowSignUp(false)}>&times;</span>
            <h2>Create Account</h2>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSignUp}>
              <div className="input-group">
                <input
                  id="signup-phone"
                  type="tel"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({...signUpData, phone: e.target.value})}
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <label htmlFor="signup-phone">Phone Number</label>
              </div>

              <div className="input-group">
                <input
                  id="signup-name"
                  type="text"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <label htmlFor="signup-name">Full Name</label>
              </div>

              <div className="input-group">
                <input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                  placeholder=" "
                  required
                  disabled={loading}
                  minLength={6}
                />
                <label htmlFor="signup-password">Password</label>
              </div>

              <div className="input-group">
                <input
                  id="signup-confirm-password"
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                  placeholder=" "
                  required
                  disabled={loading}
                  minLength={6}
                />
                <label htmlFor="signup-confirm-password">Confirm Password</label>
              </div>

              <div className="input-group">
                <select
                  id="signup-user-type"
                  value={signUpData.user_type}
                  onChange={(e) => setSignUpData({...signUpData, user_type: e.target.value as any})}
                  disabled={loading}
                >
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                </select>
                <label htmlFor="signup-user-type">Account Type</label>
              </div>

              <div className="input-group">
                <select
                  id="signup-profile-type"
                  value={signUpData.profile_type}
                  onChange={(e) => setSignUpData({...signUpData, profile_type: e.target.value as any})}
                  disabled={loading}
                >
                  <option value="regular">Regular</option>
                  <option value="student">Student</option>
                  <option value="worker">Worker</option>
                  <option value="parent">Parent</option>
                </select>
                <label htmlFor="signup-profile-type">Profile Type</label>
              </div>

              <button
                type="submit"
                className="btn-gradient"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
