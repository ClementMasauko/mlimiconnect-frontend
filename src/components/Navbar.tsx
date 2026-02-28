// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import i18n from "../i18n/config"; // adjust path if needed
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingBag,
  Package,
  MessageSquare,
  ShieldCheck,
  Leaf,
  Globe,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false);
  };

  const currentLang = i18n.language || "en";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-green-700 dark:text-green-500 animate-pulse">
            MlimiConnect
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl md:text-2xl text-green-700 dark:text-green-500 tracking-tight hover:opacity-90 transition-opacity"
          >
            <Leaf className="h-7 w-7" />
            MlimiConnect
          </Link>

          {/* Desktop Navigation – always visible links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/app/marketplace"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
              }
            >
              Marketplace
            </NavLink>

            <NavLink
              to="/app/orders"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="/app/listings"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
              }
            >
              Listings
            </NavLink>

            <NavLink
              to="/app/messages"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
              }
            >
              Messages
            </NavLink>

            <Link
              to="/admin"
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Language Switcher – Desktop */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden text-xs">
              <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  currentLang === "en"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage("ny")}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  currentLang === "ny"
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                NY
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-medium">
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.username}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors flex items-center gap-1.5"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/"
                  className="text-sm font-medium px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu – always shows all main links */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <NavLink
              to="/app/marketplace"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`
              }
            >
              Marketplace
            </NavLink>

            <NavLink
              to="/app/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="/app/listings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`
              }
            >
              Listings
            </NavLink>

            <NavLink
              to="/app/messages"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`
              }
            >
              Messages
            </NavLink>

            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-4 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
            >
              Admin Panel
            </Link>

            {/* Language Switcher in Mobile */}
            <div className="py-3 px-4 border-t border-gray-200 dark:border-gray-800 mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                <Globe size={14} /> Language
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`text-sm font-medium px-4 py-2 rounded transition-colors ${
                    currentLang === "en"
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage("ny")}
                  className={`text-sm font-medium px-4 py-2 rounded transition-colors ${
                    currentLang === "ny"
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Chichewa
                </button>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-2 py-3 px-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 bg-green-600 text-white rounded-lg text-center font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}