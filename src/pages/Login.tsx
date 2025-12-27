import React, { useState } from "react";
import { useProfile } from "../contexts/ProfileContext";
import { navigate } from "../router";
import "./Login.css";

export default function Login() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [role, setRole] = useState("normal");
  const [childProfiles, setChildProfiles] = useState([{ name: "" }]);

  // Login form state (require these to login)
  const [loginName, setLoginName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginProfileType, setLoginProfileType] = useState("regular");
  const [loginError, setLoginError] = useState("");

  const { setProfile } = useProfile();

  const handleLogin = (targetRole: string) => {
    setLoginError("");
    // require name and email for any login to proceed (frontend-only)
    if (!loginName.trim() || !loginEmail.trim()) {
      setLoginError("Please enter your name and email to continue.");
      return;
    }

    if (targetRole === "customer") {
      // Build a simple profile from the login form
      const profile = {
        name: loginName.trim(),
        status: (loginProfileType as any) || "regular",
        userType: "customer" as const,
        // default discounts: student 15%, worker 10%, regular 0%
        discount: loginProfileType === "student" ? 15 : loginProfileType === "worker" ? 10 : 0,
      };
      setProfile(profile);
    } else if (targetRole === "driver") {
      const profile = {
        name: loginName.trim(),
        status: (loginProfileType as any) || "regular",
        userType: "driver" as const,
        discount: 0,
      };
      setProfile(profile);
    } else {
      // Clear any stored profile for other roles (admin)
      setProfile(null);
    }

    navigate(`/${targetRole}`);
  };

  const handleSignUp = () => {
    alert("Sign Up logic goes here (API call or form submission).");
    setShowSignUp(false);
  };

  const handleAddChild = () => {
    setChildProfiles([...childProfiles, { name: "" }]);
  };

  const handleChildChange = (index: number, value: string) => {
    const updated = [...childProfiles];
    updated[index].name = value;
    setChildProfiles(updated);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Enter your details to continue</p>

        <div className="input-group">
          <input
            id="login-name"
            type="text"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <label htmlFor="login-name">Full name</label>
        </div>

        <div className="input-group">
          <input
            id="login-email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <label htmlFor="login-email">Email</label>
        </div>

        <div className="input-group">
          <input id="login-password" type="password" required />
          <label htmlFor="login-password">Password</label>
        </div>

        <div className="input-group">
          <select
            id="login-profile-type"
            value={loginProfileType}
            onChange={(e) => setLoginProfileType(e.target.value)}
          >
            <option value="regular">Regular</option>
            <option value="student">Student</option>
            <option value="worker">Worker</option>
          </select>
          <label htmlFor="login-profile-type">Profile Type</label>
        </div>

        {loginError && <div className="form-error">{loginError}</div>}

        <a href="#" className="forgot-link">Forgot password?</a>

        <button className="btn-gradient" onClick={() => handleLogin("customer")}>
          Login as Customer
        </button>
        <button className="btn-gradient" onClick={() => handleLogin("driver")}>
          Login as Driver
        </button>
        <button className="btn-gradient" onClick={() => handleLogin("admin")}>
          Login as Admin
        </button>

        <button className="google-signin">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width={20} />
          Sign in with Google
        </button>

        <p className="signup-text">
          Don’t have an account? <span className="signup-link" onClick={() => setShowSignUp(true)}>Sign up for free</span>
        </p>
      </div>

      {showSignUp && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={() => setShowSignUp(false)}>&times;</span>
            <h2>Create Account</h2>

            <div className="input-group">
              <input id="signup-email" type="email" required />
              <label htmlFor="signup-email">Email</label>
            </div>

            <div className="input-group">
              <input id="signup-password" type="password" required />
              <label htmlFor="signup-password">Password</label>
            </div>

            <div className="input-group">
              <select id="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="worker">Worker</option>
                <option value="parent">Parent</option>
                <option value="normal">Normal User</option>
                <option value="driver">Driver</option>
              </select>
              <label htmlFor="role-select">Profile Type</label>
            </div>

            {role === "student" && (
              <div className="input-group">
                <input id="school-id" type="file" aria-label="Upload School ID" />
                <label htmlFor="school-id">Upload School ID</label>
              </div>
            )}

            {role === "parent" && (
              <>
                {childProfiles.map((child, index) => (
                  <div className="input-group" key={index}>
                    <input
                      id={`child-name-${index}`}
                      type="text"
                      placeholder={`Child ${index + 1} Name`}
                      aria-label={`Child ${index + 1} Name`}
                      value={child.name}
                      onChange={(e) => handleChildChange(index, e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" className="small-btn" onClick={handleAddChild}>+ Add Child</button>
              </>
            )}

            {role === "driver" && (
              <>
                <div className="input-group">
                  <input id="driver-id-doc" type="file" aria-label="ID Document" />
                  <label htmlFor="driver-id-doc">ID Document</label>
                </div>
                <div className="input-group">
                  <input id="driver-license" type="file" aria-label="License" />
                  <label htmlFor="driver-license">License</label>
                </div>
                <div className="input-group">
                  <input id="driver-bike-info" type="text" placeholder="Bike Info" aria-label="Bike Info" />
                  <label htmlFor="driver-bike-info">Bike Info</label>
                </div>
              </>
            )}

            <button className="btn-gradient" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      )}
    </div>
  );
}
