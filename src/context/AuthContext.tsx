import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../lib/api";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  location?: string;
  isBuyerVerified?: boolean;
  twoFactorEnabled?: boolean;
  user_type: "farmer" | "buyer" | "admin" | string;
  account_type?: "individual" | "cooperative" | "company";
  can_buy?: boolean;
  can_sell?: boolean;
  organization_status?: "pending" | "verified" | "rejected" | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const demoUsers: Record<string, { password: string; user: User }> = {
  "farmer@demo.mw": { password: "demo123", user: { id: 1, username: "demo_farmer", email: "farmer@demo.mw", user_type: "farmer", location: "Lilongwe" } },
  "buyer@demo.mw": { password: "demo123", user: { id: 2, username: "demo_buyer", email: "buyer@demo.mw", user_type: "buyer", location: "Blantyre" } },
  "admin@demo.mw": { password: "demo123", user: { id: 3, username: "demo_admin", email: "admin@demo.mw", user_type: "admin" } },
};

export const demoLoginEnabled = import.meta.env.VITE_DEMO_LOGIN_ENABLED === "true";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<User>("/api/auth/profile/").then(({ data }) => setUser(data)).catch(() => setUser(null)).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const expire = () => setUser(null);
    window.addEventListener("mc:session-expired", expire);
    return () => window.removeEventListener("mc:session-expired", expire);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      if (demoLoginEnabled) {
        const account = demoUsers[identifier.trim().toLowerCase()];
        if (!account || account.password !== password) throw new Error("Use one of the demo accounts shown below, with password demo123.");
        setUser(account.user);
        return account.user;
      }
      const { data } = await api.post<{ user: User }>("/api/auth/login/", { identifier: identifier.trim(), password });
      setUser(data.user);
      return data.user;
    } catch (requestError: unknown) {
      const message = getApiError(requestError, "Login failed. Please check your credentials.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    void api.post("/api/auth/logout/").catch(() => undefined);
    setUser(null);
    setError(null);
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await api.get<User>("/api/auth/profile/");
    setUser(data);
  }, [user]);

  const value = useMemo<AuthContextType>(() => ({ user, isAuthenticated: !!user, isLoading, error, login, logout, refreshUserProfile }), [user, isLoading, error, login, logout, refreshUserProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
