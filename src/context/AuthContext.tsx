// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import api from "../lib/api";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  location?: string;
  isBuyerVerified?: boolean;
  twoFactorEnabled?: boolean;
  user_type: "farmer" | "buyer" | "admin" | string; // matches your DB schema
  // Add more fields later if needed: first_name, last_name, location, is_verified, etc.
}

interface Tokens {
  access: string;
  refresh: string;
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

// Demo accounts are disabled unless a deployment explicitly opts in. Set this only on
// a test/preview deployment; never enable it for the public production application.
export const demoLoginEnabled = import.meta.env.VITE_DEMO_LOGIN_ENABLED === "true";

// ────────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Restore session from localStorage on mount
  useEffect(() => {
    const loadAuth = () => {
      try {
        const storedUser = localStorage.getItem("mc_user");
        const storedAccess = localStorage.getItem("mc_access");
        const storedRefresh = localStorage.getItem("mc_refresh");

        if (storedUser && storedAccess && storedRefresh) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setTokens({
            access: storedAccess,
            refresh: storedRefresh,
          });

          // Set default Authorization header
          api.defaults.headers.common["Authorization"] = `Bearer ${storedAccess}`;
        }
      } catch (err) {
        console.error("Failed to restore auth state:", err);
        // Clean invalid state
        localStorage.removeItem("mc_user");
        localStorage.removeItem("mc_access");
        localStorage.removeItem("mc_refresh");
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  // 2. Sync state → storage + axios header
  useEffect(() => {
    if (user && tokens) {
      localStorage.setItem("mc_user", JSON.stringify(user));
      localStorage.setItem("mc_access", tokens.access);
      localStorage.setItem("mc_refresh", tokens.refresh);

      api.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
    } else {
      localStorage.removeItem("mc_user");
      localStorage.removeItem("mc_access");
      localStorage.removeItem("mc_refresh");
      delete api.defaults.headers.common["Authorization"];
    }
  }, [user, tokens]);

  // ────────────────────────────────────────────────────────────────
  // Core methods
  // ────────────────────────────────────────────────────────────────

  const login = useCallback(async (identifier: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      if (demoLoginEnabled) {
        const account = demoUsers[identifier.trim().toLowerCase()];
        if (!account || account.password !== password) {
          throw new Error("Use one of the demo accounts shown below, with password demo123.");
        }

        const demoTokens = { access: "demo-access-token", refresh: "demo-refresh-token" };
        setUser(account.user);
        setTokens(demoTokens);
        return account.user;
      }

      const res = await api.post("/api/auth/login/", {
        identifier: identifier.trim(),
        password,
      });

      const { user: userData, tokens: tokenData } = res.data;

      setUser(userData);
      setTokens(tokenData);
      return userData as User;
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message ||
        "Login failed. Please check your credentials.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    setError(null);
    // Optional: call logout endpoint if your backend invalidates tokens
    // api.post("/api/auth/logout/").catch(() => {});
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (!tokens?.access) return;

    try {
      const res = await api.get("/api/auth/profile/");
      setUser((prev) => ({ ...prev, ...res.data } as User));
    } catch (err) {
      console.warn("Failed to refresh user profile:", err);
      // You may want to logout on 401 here
    }
  }, [tokens]);

  // ────────────────────────────────────────────────────────────────
  // Memoized value
  // ────────────────────────────────────────────────────────────────

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user && !!tokens?.access,
      isLoading,
      error,
      login,
      logout,
      refreshUserProfile,
    }),
    [user, tokens, isLoading, error, login, logout, refreshUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ────────────────────────────────────────────────────────────────
// Custom hook
// ────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
