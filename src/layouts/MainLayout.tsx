// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/ui/Sidebar"; // Adjust path if needed
import Footer from "../components/ui/Footer";   // ← Your professional Footer.tsx
import { Menu, X } from "lucide-react";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close mobile sidebar on route change (optional – works with browser back/forward)
  useEffect(() => {
    const handleRouteChange = () => setIsSidebarOpen(false);
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300 flex flex-col">
      {/* Navbar – always on top */}
      <Navbar />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content wrapper */}
      <div className="flex flex-1">
        {/* Sidebar – hidden on mobile, shown on lg+ */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:block`}
        >
          <Sidebar />
        </div>

        {/* Page content + Footer */}
        <div className="flex-1 flex flex-col">
          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>

          {/* Your professional Footer */}
          <Footer />
        </div>
      </div>

      {/* Mobile sidebar toggle button – floating bottom-right */}
      <button
        className="fixed bottom-6 right-6 z-50 lg:hidden p-4 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-4 focus:ring-green-500/30"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}