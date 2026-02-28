// src/layouts/AdminLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "../lib/utils";

import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Adjust this value to match your actual navbar height
  const navbarHeight = "4rem"; // usually 64px → "4rem"

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full">
        <AdminNavbar onToggleSidebar={toggleSidebar} />
      </header>

      <div className="relative flex flex-1">
        {/* Desktop Sidebar – fixed below navbar */}
        <aside
          className={cn(
            "hidden lg:block lg:fixed lg:z-40 lg:transition-all lg:duration-300 lg:ease-in-out",
            "lg:top-[${navbarHeight}] lg:bottom-0 lg:left-0",
            sidebarCollapsed ? "lg:w-16" : "lg:w-64"
          )}
        >
          <div className="h-full">
            <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          </div>
        </aside>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto lg:transition-all lg:duration-300 lg:ease-in-out",
            sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          )}
        >
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            {/* Remove this debug banner in production */}
            <div className="mb-6 rounded-lg bg-yellow-100/80 dark:bg-yellow-900/40 p-4 text-center text-yellow-800 dark:text-yellow-200 border border-yellow-300/50 dark:border-yellow-700/50">
              ADMIN AREA – CONTENT BELOW IS YOUR PAGE (Outlet)
            </div>

            <Outlet />
          </div>
        </main>

        {/* Mobile sidebar drawer */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden transition-transform duration-300 ease-in-out",
            sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarCollapsed(true)}
          />
          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            <AdminSidebar collapsed={false} onToggle={() => setSidebarCollapsed(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}