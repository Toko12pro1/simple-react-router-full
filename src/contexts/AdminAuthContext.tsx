import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  adminName: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Hardcoded credentials for MVP (admin/admin123)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  // Check localStorage on mount for persistent login
  useEffect(() => {
    const stored = localStorage.getItem("adminAuth");
    if (stored) {
      try {
        const { name } = JSON.parse(stored);
        setAdminName(name);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("adminAuth");
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminName(username);
      setIsLoggedIn(true);
      localStorage.setItem("adminAuth", JSON.stringify({ name: username }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminName(null);
    setIsLoggedIn(false);
    localStorage.removeItem("adminAuth");
  };

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, adminName, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
