import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/ui/Sidebar";
import Footer from "../components/ui/Footer";
import { BackNavigation } from "../components/RouteExperience";

export default function MainLayout() {
  const { pathname } = useLocation();
  const previewPrefixes = ["/app/advisory", "/app/analytics", "/app/messages", "/app/traceability", "/app/wallet"];
  const isPreviewFeature = previewPrefixes.some(prefix => pathname.startsWith(prefix));
  return (
    <div className="marketplace-app flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">
            <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
              <BackNavigation />
              {isPreviewFeature && <div role="status" className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">Preview module: information and actions on this screen are demonstration-only until its server integration is completed.</div>}
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
