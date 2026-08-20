import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/ui/Sidebar";
import Footer from "../components/ui/Footer";

export default function MainLayout() {
  return (
    <div className="marketplace-app flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">
            <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
