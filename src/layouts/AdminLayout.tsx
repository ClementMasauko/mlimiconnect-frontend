import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed((previous) => !previous);

  return (
    <div className="marketplace-app admin-app flex min-h-screen flex-col bg-slate-50 dark:bg-gray-950">
      <AdminNavbar onToggleSidebar={toggleSidebar} />
      <div className="flex min-h-0 flex-1">
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto min-h-full max-w-screen-2xl p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
