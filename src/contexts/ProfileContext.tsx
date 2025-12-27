import React, { createContext, useContext, useEffect, useState } from "react";

export type UserProfile = {
  name: string;
  status: "student" | "worker" | "regular";
  userType: "customer" | "driver";
  discount?: number;
};

type ProfileContextType = {
  profile: UserProfile | null;
  setProfile: (p: UserProfile | null) => void;
  logout: () => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem("profile");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (profile) localStorage.setItem("profile", JSON.stringify(profile));
    else localStorage.removeItem("profile");
  }, [profile]);

  const setProfile = (p: UserProfile | null) => setProfileState(p);
  const logout = () => setProfileState(null);

  return <ProfileContext.Provider value={{ profile, setProfile, logout }}>{children}</ProfileContext.Provider>;
};

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

export default ProfileContext;
