import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import { BackNavigation } from "../components/RouteExperience";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const setMobileSidebar = useCallback((open: boolean) => setMobileSidebarOpen(open), []);
  const toggleSidebar = () => setSidebarCollapsed((previous) => !previous);

  return (
    <div className="marketplace-app admin-app flex min-h-screen flex-col bg-slate-50 dark:bg-gray-950">
      <AdminNavbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onMobileOpenChange={setMobileSidebar}
          onToggle={toggleSidebar}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto min-h-full max-w-screen-2xl px-4 py-5 sm:px-6 sm:py-6 lg:p-8">
            <BackNavigation />
            <div role="status" className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">Preview administration: dashboards and actions remain demonstration-only until each operational API is connected.</div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
