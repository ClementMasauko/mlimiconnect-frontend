// src/components/admin/AdminNavbar.tsx
import { Link } from "react-router-dom";
import { Menu, Settings, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "../BrandLogo";

interface AdminNavbarProps {
  onOpenSidebar?: () => void;
}

export default function AdminNavbar({ onOpenSidebar }: AdminNavbarProps) {
  const { user } = useAuth();
  const displayName = user?.username || "Admin";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto max-w-full px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSidebar}
              className="-ml-1 grid min-h-11 min-w-11 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu size={24} />
            </button>
            <BrandLogo to="/admin" />
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="max-w-40 truncate text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
                <Link
                  to="/app/profile"
                  className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center gap-2"><UserRound size={16} /> My Profile</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center gap-2"><Settings size={16} /> Settings &amp; account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
