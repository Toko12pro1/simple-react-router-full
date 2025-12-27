import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { authAPI } from "../lib/auth";
import type { Profile } from "../lib/supabase";

export type UserProfile = Profile & {
  userType: "customer" | "driver" | "admin";
};

type ProfileContextType = {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (p: UserProfile | null) => void;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        authAPI.getProfile()
          .then((data) => {
            setProfileState({
              ...data,
              userType: data.user_type
            });
          })
          .catch((error) => {
            console.error('Failed to fetch profile:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        authAPI.getProfile()
          .then((data) => {
            setProfileState({
              ...data,
              userType: data.user_type
            });
          })
          .catch((error) => {
            console.error('Failed to fetch profile:', error);
            setProfileState(null);
          });
      } else {
        setProfileState(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setProfile = (p: UserProfile | null) => setProfileState(p);

  const refreshProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setProfileState({
        ...data,
        userType: data.user_type
      });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setProfileState(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, setProfile, refreshProfile, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

export default ProfileContext;
